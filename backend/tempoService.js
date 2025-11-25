const TEMPO_API_BASE = "https://www.api-couleur-tempo.fr/api";
const DEFAULT_TIMEZONE = "Europe/Paris";
const CACHE_TTL_MS = 15 * 60 * 1000;

let tempoCache = {
    data: null,
    fetchedAt: 0,
    expiresAt: 0,
};

function normalizeColor(rawColor) {
    if (!rawColor) return null;
    const lowered = String(rawColor).toLowerCase();
    if (lowered.includes("bleu") || lowered === "1") return "BLEU";
    if (lowered.includes("blanc") || lowered === "2") return "BLANC";
    if (lowered.includes("rouge") || lowered === "3") return "ROUGE";
    return null;
}

function parseTimeToMinutes(timeString) {
    if (!timeString) return null;
    const [h, m] = timeString.split(":").map((part) => parseInt(part, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
}

function getLocalMinutes(date, timezone) {
    const tzDate = new Date(
        date.toLocaleString("en-US", { timeZone: timezone || DEFAULT_TIMEZONE })
    );
    return tzDate.getHours() * 60 + tzDate.getMinutes();
}

function isPeakMinute(localMinutes, startMinutes, endMinutes) {
    if (
        startMinutes === null ||
        endMinutes === null ||
        startMinutes === endMinutes
    ) {
        return false;
    }
    if (startMinutes < endMinutes) {
        return localMinutes >= startMinutes && localMinutes < endMinutes;
    }
    // Créneau qui traverse minuit
    return (
        localMinutes >= startMinutes || localMinutes < endMinutes % (24 * 60)
    );
}

/**
 * Récupère les couleurs Tempo depuis l'API
 * Essaie plusieurs routes possibles
 */
async function fetchTempoData() {
    const now = Date.now();
    
    // Utiliser le cache si valide
    if (tempoCache.data && tempoCache.expiresAt > now) {
        return tempoCache.data;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    let todayColor = null;
    let tomorrowColor = null;
    let remainingDays = { bleu: null, blanc: null, rouge: null };

    // Essayer différentes routes pour obtenir les données
    const routesToTry = [
        { url: `${TEMPO_API_BASE}/jourTempo/today`, type: 'today' },
        { url: `${TEMPO_API_BASE}/jour_tempos?dateJour=${todayStr}`, type: 'today' },
        { url: `${TEMPO_API_BASE}/jourTempos?dateJour=${todayStr}`, type: 'today' },
    ];

    // Essayer de récupérer la couleur d'aujourd'hui
    for (const route of routesToTry) {
        if (todayColor) break;
        try {
            console.log(`[Tempo] Trying: ${route.url}`);
            const res = await fetch(route.url);
            if (res.ok) {
                const data = await res.json();
                console.log(`[Tempo] Response:`, JSON.stringify(data).substring(0, 200));
                
                // Gérer différents formats de réponse
                if (Array.isArray(data)) {
                    const todayEntry = data.find(d => d.dateJour === todayStr || d.date === todayStr);
                    if (todayEntry) {
                        todayColor = normalizeColor(todayEntry.codeJour) || 
                                    normalizeColor(todayEntry.couleur) ||
                                    normalizeColor(todayEntry.color);
                    }
                } else if (data['hydra:member']) {
                    const todayEntry = data['hydra:member'].find(d => d.dateJour === todayStr);
                    if (todayEntry) {
                        todayColor = normalizeColor(todayEntry.codeJour) || normalizeColor(todayEntry.couleur);
                    }
                } else {
                    todayColor = normalizeColor(data.codeJour) || 
                                normalizeColor(data.couleur) ||
                                normalizeColor(data.couleurJour) ||
                                normalizeColor(data.color);
                }
            }
        } catch (e) {
            console.log(`[Tempo] Route failed: ${route.url}`, e.message);
        }
    }

    // Essayer de récupérer la couleur de demain
    const tomorrowRoutes = [
        { url: `${TEMPO_API_BASE}/jourTempo/tomorrow` },
        { url: `${TEMPO_API_BASE}/jour_tempos?dateJour=${tomorrowStr}` },
        { url: `${TEMPO_API_BASE}/jourTempos?dateJour=${tomorrowStr}` },
    ];

    for (const route of tomorrowRoutes) {
        if (tomorrowColor) break;
        try {
            const res = await fetch(route.url);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    const entry = data.find(d => d.dateJour === tomorrowStr || d.date === tomorrowStr);
                    if (entry) {
                        tomorrowColor = normalizeColor(entry.codeJour) || normalizeColor(entry.couleur);
                    }
                } else if (data['hydra:member']) {
                    const entry = data['hydra:member'].find(d => d.dateJour === tomorrowStr);
                    if (entry) {
                        tomorrowColor = normalizeColor(entry.codeJour) || normalizeColor(entry.couleur);
                    }
                } else {
                    tomorrowColor = normalizeColor(data.codeJour) || normalizeColor(data.couleur);
                }
            }
        } catch (e) {
            // Ignorer silencieusement
        }
    }

    // Essayer de récupérer les statistiques de jours restants
    try {
        const statsRes = await fetch(`${TEMPO_API_BASE}/statistiques`);
        if (statsRes.ok) {
            const statsData = await statsRes.json();
            console.log(`[Tempo] Stats response:`, JSON.stringify(statsData).substring(0, 300));
            
            // Gérer différents formats
            const stats = Array.isArray(statsData) ? statsData[0] : 
                         statsData['hydra:member'] ? statsData['hydra:member'][0] : 
                         statsData;
            
            if (stats) {
                remainingDays = {
                    bleu: stats.joursBleuRestants ?? stats.bleuRestant ?? null,
                    blanc: stats.joursBlancRestants ?? stats.blancRestant ?? null,
                    rouge: stats.joursRougeRestants ?? stats.rougeRestant ?? null,
                    bleuUsed: stats.joursBleuConsommes ?? stats.bleuConsomme ?? null,
                    blancUsed: stats.joursBlancConsommes ?? stats.blancConsomme ?? null,
                    rougeUsed: stats.joursRougeConsommes ?? stats.rougeConsomme ?? null,
                };
            }
        }
    } catch (e) {
        console.log(`[Tempo] Stats failed:`, e.message);
    }

    const result = { todayColor, tomorrowColor, remainingDays };
    
    // Mettre en cache
    tempoCache = {
        data: result,
        fetchedAt: now,
        expiresAt: now + CACHE_TTL_MS,
    };

    return result;
}

async function getHourTypeForContract(contractRow, referenceDate = new Date()) {
    if (!contractRow) return null;

    const contractType = (contractRow.contract_type || "")
        .toString()
        .toUpperCase();
    const timezone = contractRow.hp_timezone || DEFAULT_TIMEZONE;
    const hpStart = parseTimeToMinutes(contractRow.hp_start);
    const hpEnd = parseTimeToMinutes(contractRow.hp_end);
    const localMinutes = getLocalMinutes(referenceDate, timezone);
    const isPeak = isPeakMinute(localMinutes, hpStart, hpEnd);

    if (contractType === "BASE") {
        return "BASE";
    }

    if (contractType === "HPHC") {
        return isPeak ? "HP" : "HC";
    }

    if (contractType === "TEMPO") {
        try {
            const tempoData = await fetchTempoData();
            const color = tempoData.todayColor;
            if (!color) return isPeak ? "HP" : "HC";
            
            const prefix = isPeak ? "HP" : "HC";
            const suffix = color === "BLEU" ? "B" : color === "BLANC" ? "W" : "R";
            return `${prefix}${suffix}`;
        } catch (error) {
            return isPeak ? "HP" : "HC";
        }
    }

    return null;
}

/**
 * Récupère les infos Tempo complètes
 */
async function getTempoInfo(contractRow = null) {
    const now = new Date();
    const timezone = contractRow?.hp_timezone || DEFAULT_TIMEZONE;
    const hpStart = parseTimeToMinutes(contractRow?.hp_start);
    const hpEnd = parseTimeToMinutes(contractRow?.hp_end);
    const localMinutes = getLocalMinutes(now, timezone);
    const isPeak = isPeakMinute(localMinutes, hpStart, hpEnd);

    // Récupérer les données Tempo
    const tempoData = await fetchTempoData();

    // Heures HP/HC pour l'affichage (format court)
    const hpStartStr = contractRow?.hp_start?.substring(0, 5) || "06:00";
    const hpEndStr = contractRow?.hp_end?.substring(0, 5) || "22:00";

    return {
        contractType: contractRow?.contract_type || null,
        todayColor: tempoData.todayColor,
        tomorrowColor: tempoData.tomorrowColor,
        isPeakHour: isPeak,
        peakHourStart: hpStartStr,
        peakHourEnd: hpEndStr,
        remainingDays: tempoData.remainingDays,
        timestamp: now.toISOString(),
    };
}

module.exports = {
    getHourTypeForContract,
    getTempoInfo,
};

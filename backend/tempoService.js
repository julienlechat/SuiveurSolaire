const TEMPO_API_BASE = "https://www.api-couleur-tempo.fr/api";
const DEFAULT_TIMEZONE = "Europe/Paris";
const CACHE_TTL_MS = 15 * 60 * 1000;

let tempoCache = {
    color: null,
    fetchedAt: 0,
    expiresAt: 0,
};

function normalizeColor(rawColor) {
    if (!rawColor) return null;
    const lowered = String(rawColor).toLowerCase();
    if (lowered.includes("bleu")) return "BLEU";
    if (lowered.includes("blanc")) return "BLANC";
    if (lowered.includes("rouge")) return "ROUGE";
    return null;
}

async function fetchTempoColor() {
    const now = Date.now();
    if (tempoCache.color && tempoCache.expiresAt > now) {
        return tempoCache.color;
    }

    try {
        const response = await fetch(`${TEMPO_API_BASE}/jourTempo/today`);
        if (!response.ok) {
            throw new Error(
                `Tempo API error (${response.status} ${response.statusText})`
            );
        }
        const data = await response.json();
        // L'API peut renvoyer plusieurs formats de clé selon les ressources.
        const color =
            normalizeColor(data?.couleur) ||
            normalizeColor(data?.couleurJour) ||
            normalizeColor(data?.Jour?.couleur) ||
            normalizeColor(data?.jourTempo?.couleur);
        if (!color) {
            throw new Error("Tempo API returned unknown color payload");
        }

        tempoCache = {
            color,
            fetchedAt: now,
            expiresAt: now + CACHE_TTL_MS,
        };
        return color;
    } catch (error) {
        console.error("[TempoService] Unable to fetch tempo color:", error);
        // Laisser expirer rapidement afin de retenter plus tard
        tempoCache.expiresAt = Date.now() + 5 * 60 * 1000;
        throw error;
    }
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
        let color;
        try {
            color = await fetchTempoColor();
        } catch (error) {
            // Impossible de récupérer la couleur : se replier sur HP/HC uniquement
            return isPeak ? "HP" : "HC";
        }
        const prefix = isPeak ? "HP" : "HC";
        const suffix = color === "BLEU" ? "B" : color === "BLANC" ? "W" : "R";
        return `${prefix}${suffix}`;
    }

    return null;
}

/**
 * Récupère les infos Tempo complètes :
 * - Couleur aujourd'hui et demain
 * - Jours restants par couleur
 * - Heure creuse/pleine actuelle
 */
async function getTempoInfo(contractRow = null) {
    const now = new Date();
    const timezone = contractRow?.hp_timezone || DEFAULT_TIMEZONE;
    const hpStart = parseTimeToMinutes(contractRow?.hp_start);
    const hpEnd = parseTimeToMinutes(contractRow?.hp_end);
    const localMinutes = getLocalMinutes(now, timezone);
    const isPeak = isPeakMinute(localMinutes, hpStart, hpEnd);

    let todayColor = null;
    let tomorrowColor = null;
    let remainingDays = { bleu: null, blanc: null, rouge: null };

    try {
        // Couleur aujourd'hui
        const todayRes = await fetch(`${TEMPO_API_BASE}/jourTempo/today`);
        if (todayRes.ok) {
            const todayData = await todayRes.json();
            todayColor = normalizeColor(todayData?.codeJour) || 
                         normalizeColor(todayData?.couleur) ||
                         normalizeColor(todayData?.couleurJour);
        }
    } catch (e) {
        console.error("[TempoService] Error fetching today color:", e);
    }

    try {
        // Couleur demain
        const tomorrowRes = await fetch(`${TEMPO_API_BASE}/jourTempo/tomorrow`);
        if (tomorrowRes.ok) {
            const tomorrowData = await tomorrowRes.json();
            tomorrowColor = normalizeColor(tomorrowData?.codeJour) ||
                           normalizeColor(tomorrowData?.couleur) ||
                           normalizeColor(tomorrowData?.couleurJour);
        }
    } catch (e) {
        console.error("[TempoService] Error fetching tomorrow color:", e);
    }

    try {
        // Jours restants
        const currentYear = now.getFullYear();
        // L'année Tempo va du 1er septembre au 31 août
        const tempoYear = now.getMonth() >= 8 ? currentYear : currentYear - 1;
        
        const remainingRes = await fetch(`${TEMPO_API_BASE}/joursTempo/periode/${tempoYear}-09-01/${tempoYear + 1}-08-31`);
        if (remainingRes.ok) {
            const allDays = await remainingRes.json();
            if (Array.isArray(allDays)) {
                // Compter les jours par couleur
                let bleuTotal = 0, blancTotal = 0, rougeTotal = 0;
                let bleuUsed = 0, blancUsed = 0, rougeUsed = 0;
                
                const todayStr = now.toISOString().split('T')[0];
                
                allDays.forEach(day => {
                    const color = normalizeColor(day.codeJour) || normalizeColor(day.couleur);
                    const dayDate = day.dateJour || day.date;
                    const isPast = dayDate < todayStr;
                    
                    if (color === 'BLEU') {
                        bleuTotal++;
                        if (isPast) bleuUsed++;
                    } else if (color === 'BLANC') {
                        blancTotal++;
                        if (isPast) blancUsed++;
                    } else if (color === 'ROUGE') {
                        rougeTotal++;
                        if (isPast) rougeUsed++;
                    }
                });

                // Quotas Tempo: 300 bleu, 43 blanc, 22 rouge
                remainingDays = {
                    bleu: Math.max(0, 300 - bleuUsed),
                    blanc: Math.max(0, 43 - blancUsed),
                    rouge: Math.max(0, 22 - rougeUsed),
                    bleuUsed,
                    blancUsed,
                    rougeUsed,
                };
            }
        }
    } catch (e) {
        console.error("[TempoService] Error fetching remaining days:", e);
    }

    // Heures HP/HC pour l'affichage
    const hpStartStr = contractRow?.hp_start || "06:00";
    const hpEndStr = contractRow?.hp_end || "22:00";

    return {
        contractType: contractRow?.contract_type || null,
        todayColor,
        tomorrowColor,
        isPeakHour: isPeak,
        peakHourStart: hpStartStr,
        peakHourEnd: hpEndStr,
        remainingDays,
        timestamp: now.toISOString(),
    };
}

module.exports = {
    getHourTypeForContract,
    getTempoInfo,
};

const TEMPO_API_BASE = "https://www.api-couleur-tempo.fr/api";
const DEFAULT_TIMEZONE = "Europe/Paris";
const CACHE_TTL_MS = 15 * 60 * 1000;

let tempoCache = {
    color: null,
    fetchedAt: 0,
    expiresAt: 0,
};

let tempoNowCache = {
    data: null,
    fetchedAt: 0,
    expiresAt: 0,
};

let tempoStatsCache = {
    data: null,
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

/**
 * Récupère la couleur du jour via l'API Tempo
 */
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
        tempoCache.expiresAt = Date.now() + 5 * 60 * 1000;
        throw error;
    }
}

/**
 * Récupère les infos temps réel : couleur, code horaire, tarif
 * GET /api/now
 */
async function fetchTempoNow() {
    const now = Date.now();
    if (tempoNowCache.data && tempoNowCache.expiresAt > now) {
        return tempoNowCache.data;
    }

    try {
        const response = await fetch(`${TEMPO_API_BASE}/TempsReel`);
        if (!response.ok) {
            throw new Error(`Tempo Now API error (${response.status})`);
        }
        const data = await response.json();
        
        tempoNowCache = {
            data,
            fetchedAt: now,
            expiresAt: now + 60 * 1000, // Cache 1 minute pour les données temps réel
        };
        return data;
    } catch (error) {
        console.error("[TempoService] Unable to fetch tempo now:", error);
        throw error;
    }
}

/**
 * Récupère les statistiques : jours consommés/restants par couleur
 * GET /api/stats
 */
async function fetchTempoStats() {
    const now = Date.now();
    if (tempoStatsCache.data && tempoStatsCache.expiresAt > now) {
        return tempoStatsCache.data;
    }

    try {
        const response = await fetch(`${TEMPO_API_BASE}/Statistiques`);
        if (!response.ok) {
            throw new Error(`Tempo Stats API error (${response.status})`);
        }
        const data = await response.json();
        
        tempoStatsCache = {
            data,
            fetchedAt: now,
            expiresAt: now + CACHE_TTL_MS,
        };
        return data;
    } catch (error) {
        console.error("[TempoService] Unable to fetch tempo stats:", error);
        throw error;
    }
}

/**
 * Récupère la couleur d'aujourd'hui via /jourTempo/today
 */
async function fetchTempoToday() {
    try {
        const response = await fetch(`${TEMPO_API_BASE}/jourTempo/today`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return normalizeColor(data?.libCouleur) || 
               normalizeColor(data?.couleur);
    } catch (error) {
        console.error("[TempoService] Unable to fetch tempo today:", error);
        return null;
    }
}

/**
 * Récupère la couleur de demain via /jourTempo/tomorrow
 */
async function fetchTempoTomorrow() {
    try {
        const response = await fetch(`${TEMPO_API_BASE}/jourTempo/tomorrow`);
        if (!response.ok) {
            // Couleur de demain pas encore disponible (avant 11h)
            return null;
        }
        const data = await response.json();
        return normalizeColor(data?.libCouleur) || 
               normalizeColor(data?.couleur);
    } catch (error) {
        console.error("[TempoService] Unable to fetch tempo tomorrow:", error);
        return null;
    }
}

/**
 * Récupère toutes les infos Tempo pour le dashboard
 * Fonctionne même sans contrat configuré (affichage informatif)
 */
async function getTempoInfo(contractRow) {
    try {
        const [todayColor, tomorrowColor, nowData, stats] = await Promise.all([
            fetchTempoToday().catch(() => null),
            fetchTempoTomorrow().catch(() => null),
            fetchTempoNow().catch(() => null),
            fetchTempoStats().catch(() => null),
        ]);

        // Déterminer HP/HC (6h-22h = HP)
        const now = new Date();
        const hour = now.getHours();
        const isHeuresCreuses = hour < 6 || hour >= 22;

        return {
            todayColor,
            tomorrowColor,
            isHeuresCreuses,
            tarifActuel: nowData?.tarifKwh || null,
            libelleTarif: nowData?.libTarif || null,
            stats: stats ? {
                periode: stats.periode,
                joursBleuRestants: stats.joursBleusRestants,
                joursBlancRestants: stats.joursBlancsRestants,
                joursRougeRestants: stats.joursRougesRestants,
                joursBleuConsommes: stats.joursBleusConsommes,
                joursBlancConsommes: stats.joursBlancsConsommes,
                joursRougeConsommes: stats.joursRougesConsommes,
            } : null,
        };
    } catch (error) {
        console.error("[TempoService] getTempoInfo error:", error);
        return null;
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
            return isPeak ? "HP" : "HC";
        }
        const prefix = isPeak ? "HP" : "HC";
        const suffix = color === "BLEU" ? "B" : color === "BLANC" ? "W" : "R";
        return `${prefix}${suffix}`;
    }

    return null;
}

/**
 * Récupère l'historique des couleurs Tempo pour un mois donné
 */
async function fetchTempoCalendar(year, month) {
    try {
        // Construire les dates du mois
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Dernier jour du mois
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const days = [];
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const dayData = {
                date: dateStr,
                day: d.getDate(),
                dayOfWeek: d.getDay(), // 0 = dimanche
                isToday: d.getTime() === today.getTime(),
                isFuture: d > today,
                color: null,
            };

            // Pour les jours passés et aujourd'hui, récupérer la couleur
            if (!dayData.isFuture || dayData.isToday) {
                try {
                    const response = await fetch(`${TEMPO_API_BASE}/jourTempo/${dateStr}`);
                    if (response.ok) {
                        const data = await response.json();
                        dayData.color = normalizeColor(data?.couleur) || 
                                       normalizeColor(data?.couleurJour) ||
                                       normalizeColor(data?.jourTempo?.couleur);
                    }
                } catch (e) {
                    // Ignorer les erreurs pour un jour spécifique
                }
            }

            // Pour demain
            if (d.getTime() === today.getTime() + 86400000) {
                try {
                    const response = await fetch(`${TEMPO_API_BASE}/jourTempo/tomorrow`);
                    if (response.ok) {
                        const data = await response.json();
                        dayData.color = normalizeColor(data?.couleur) || 
                                       normalizeColor(data?.couleurJour) ||
                                       normalizeColor(data?.jourTempo?.couleur);
                    }
                } catch (e) {
                    // Couleur de demain pas encore connue
                }
            }

            days.push(dayData);
        }

        return {
            year,
            month,
            days,
        };
    } catch (error) {
        console.error("[TempoService] fetchTempoCalendar error:", error);
        return null;
    }
}

module.exports = {
    getHourTypeForContract,
    getTempoInfo,
    fetchTempoColor,
    fetchTempoNow,
    fetchTempoStats,
    fetchTempoCalendar,
};

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

module.exports = {
    getHourTypeForContract,
};

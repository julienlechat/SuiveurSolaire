// api.js
const API_BASE = (() => {
    // 1) Si VITE_API_BASE_URL est défini, on l'utilise
    const envBase = import.meta.env.VITE_API_BASE_URL;
    if (envBase && envBase.trim() !== "") {
        return envBase.replace(/\/$/, ""); // on enlève un '/' final éventuel
    }

    // 2) Sinon, on déduit depuis l'URL du front
    const { protocol, hostname } = window.location;

    // Si ton backend reste sur le port 3001 :
    const backendPort = 3001;

    return `${protocol}//${hostname}:${backendPort}`;
})();

console.log("[API] API_BASE =", API_BASE);

export async function fetchLatest() {
    const url = `${API_BASE}/api/latest`;
    console.log("[API] GET", url);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return res.json();
}

export async function fetchDailyStats(date = null) {
    // Si pas de date fournie, on prend aujourd'hui
    const dateStr = date || new Date().toISOString().split('T')[0];
    const url = `${API_BASE}/api/daily-stats?date=${dateStr}`;
    console.log("[API] GET", url);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return res.json();
}
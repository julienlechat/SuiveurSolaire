// api.js
const API_BASE = (() => {
    const envBase = import.meta.env.VITE_API_BASE_URL;
    if (envBase && envBase.trim() !== "") {
        return envBase.replace(/\/$/, "");
    }
    const { protocol, hostname } = window.location;
    const backendPort = 3001;
    return `${protocol}//${hostname}:${backendPort}`;
})();

console.log("[API] API_BASE =", API_BASE);

export async function fetchLatest() {
    const url = `${API_BASE}/api/latest`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function fetchHistoryGraph(date) {
    const dateStr = date || new Date().toISOString().split("T")[0];
    const url = `${API_BASE}/api/history-graph?date=${dateStr}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function fetchTempo() {
    const url = `${API_BASE}/api/tempo`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

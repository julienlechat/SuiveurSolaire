import { useEffect, useState } from "react";
import { fetchLatest } from "./api";

const REFRESH_MS = Number(import.meta.env.VITE_REFRESH_MS || 5000);

function formatNumber(value, digits = 2) {
    if (value === null || value === undefined) return "—";
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return n.toFixed(digits);
}

function App() {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        let timer;

        async function load() {
            try {
                setError(null);
                const data = await fetchLatest();
                if (data.ok) {
                    setPoints(data.points || []);
                    setLastUpdate(new Date());
                } else {
                    setError(data.error || "Erreur inconnue");
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        load();
        timer = setInterval(load, REFRESH_MS);

        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", padding: "1.5rem" }}>
            <h1>SuiveurEnergie – Dashboard</h1>
            <p style={{ color: "#666" }}>
                Backend:{" "}
                {import.meta.env.VITE_API_BASE_URL ||
                    "(déduit depuis le front)"}{" "}
                — refresh: {REFRESH_MS / 1000}s
            </p>

            {lastUpdate && (
                <p style={{ fontSize: "0.9rem", color: "#888" }}>
                    Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
                </p>
            )}

            {loading && <p>Chargement...</p>}
            {error && <p style={{ color: "red" }}>Erreur: {error}</p>}

            <div
                style={{
                    marginTop: "1rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1rem",
                }}
            >
                {points.map((p) => (
                    <div
                        key={p.point_id}
                        style={{
                            borderRadius: "12px",
                            padding: "1rem",
                            border: "1px solid #ddd",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                    >
                        <h2 style={{ margin: 0 }}>{p.point_name}</h2>
                        <p style={{ margin: "0.2rem 0", color: "#777" }}>
                            Module {p.module}, Channel {p.channel}
                        </p>

                        {/* Puissance */}
                        <p style={{ fontSize: "1.8rem", margin: "0.5rem 0" }}>
                            {formatNumber(p.power_w, 1)} W
                        </p>

                        {/* Tension / courant */}
                        <p style={{ margin: "0.2rem 0" }}>
                            U: {formatNumber(p.voltage_v, 1)} V
                            <br />
                            I: {formatNumber(p.current_a, 3)} A
                        </p>

                        {/* PF + sens */}
                        <p
                            style={{
                                margin: "0.2rem 0",
                                fontSize: "0.9rem",
                                color: "#666",
                            }}
                        >
                            PF: {formatNumber(p.power_factor, 3)}
                            <br />
                            Sens: {p.direction_export ? "Export" : "Import"}
                        </p>

                        {/* kWh + hour_type */}
                        <p
                            style={{
                                margin: "0.2rem 0",
                                fontSize: "0.8rem",
                                color: "#999",
                            }}
                        >
                            kWh import: {formatNumber(p.import_kwh_total, 3)}
                            <br />
                            kWh export: {formatNumber(p.export_kwh_total, 3)}
                            <br />
                            hour_type: {p.hour_type || "—"}
                        </p>

                        {/* Timestamp de la mesure */}
                        {p.ts && (
                            <p
                                style={{
                                    margin: "0.2rem 0",
                                    fontSize: "0.8rem",
                                    color: "#999",
                                }}
                            >
                                Mesure: {new Date(p.ts).toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;

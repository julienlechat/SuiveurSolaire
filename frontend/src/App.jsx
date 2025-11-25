import { useEffect, useState } from "react";
import { fetchLatest, fetchHistoryGraph } from "./api";
import Sidebar from "./components/Sidebar";
import EnergyCard from "./components/EnergyCard";
import DailyStats from "./components/DailyStats";
import PowerChart from "./components/PowerChart";
import PointDetails from "./components/PointDetails";

const REFRESH_MS = Number(import.meta.env.VITE_REFRESH_MS || 5000);

// Palette de couleurs pour les points de mesure
const COLOR_PALETTE = [
    "#3b82f6", // Bleu
    "#ef4444", // Rouge
    "#f59e0b", // Orange
    "#10b981", // Vert
    "#8b5cf6", // Violet
    "#ec4899", // Rose
];

function getPointColor(pointId) {
    return COLOR_PALETTE[(pointId - 1) % COLOR_PALETTE.length];
}

function App() {
    const [points, setPoints] = useState([]);
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingGraph, setLoadingGraph] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    // Charger les données en temps réel
    useEffect(() => {
        let timer;

        async function load() {
            try {
                setError(null);
                const data = await fetchLatest();
                if (data.ok) {
                    setPoints(data.points || []);
                    setLastUpdate(new Date());
                    setConnectionStatus("connected");
                } else {
                    setError(data.error || "Erreur inconnue");
                    setConnectionStatus("disconnected");
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
                setConnectionStatus("disconnected");
            } finally {
                setLoading(false);
            }
        }

        load();
        timer = setInterval(load, REFRESH_MS);

        return () => clearInterval(timer);
    }, []);

    // Charger les données graphiques
    useEffect(() => {
        async function loadGraph() {
            try {
                setLoadingGraph(true);
                const data = await fetchHistoryGraph(selectedDate);
                if (data.ok) {
                    setGraphData(data);
                }
            } catch (err) {
                console.error("Erreur chargement graphique:", err);
            } finally {
                setLoadingGraph(false);
            }
        }

        loadGraph();
    }, [selectedDate]);

    const isToday = selectedDate === new Date().toISOString().split("T")[0];
    const isYesterday =
        selectedDate ===
        new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // Calculer la puissance totale en temps réel
    const totalPower = points.reduce((sum, p) => sum + (p.power_w || 0), 0);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
            {/* Sidebar */}
            <Sidebar connectionStatus={connectionStatus} />

            {/* Contenu principal */}
            <div className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Icône énergie */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-7 h-7 text-white"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Tableau de bord
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className={`inline-flex items-center gap-1.5 text-sm ${
                                            connectionStatus === "connected"
                                                ? "text-emerald-600"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                                connectionStatus === "connected"
                                                    ? "bg-emerald-500 animate-pulse"
                                                    : "bg-slate-400"
                                            }`}
                                        ></span>
                                        {connectionStatus === "connected"
                                            ? "En ligne"
                                            : "Hors ligne"}
                                    </span>
                                    {lastUpdate && (
                                        <span className="text-slate-400 text-sm">
                                            • Mis à jour à{" "}
                                            {lastUpdate.toLocaleTimeString(
                                                "fr-FR",
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sélecteur de date */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    setSelectedDate(
                                        new Date().toISOString().split("T")[0]
                                    )
                                }
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                    isToday
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                Aujourd'hui
                            </button>
                            <button
                                onClick={() =>
                                    setSelectedDate(
                                        new Date(Date.now() - 86400000)
                                            .toISOString()
                                            .split("T")[0]
                                    )
                                }
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                    isYesterday
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                Hier
                            </button>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </header>

                {/* Contenu scrollable */}
                <div className="p-8 space-y-6">
                    {/* SECTION 1 : Stats globales du jour */}
                    <DailyStats
                        stats={graphData?.stats}
                        loading={loadingGraph}
                        totalPowerNow={totalPower}
                        selectedDate={selectedDate}
                        isToday={isToday}
                    />

                    {/* SECTION 2 : Mesures en temps réel */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-800 text-sm">
                                ⚠️ Erreur: {error}
                            </p>
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl p-5 animate-pulse"
                                >
                                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : points.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {points.map((point) => (
                                <EnergyCard
                                    key={point.point_id}
                                    name={point.point_name}
                                    power={point.power_w}
                                    voltage={point.voltage_v}
                                    current={point.current_a}
                                    powerFactor={point.power_factor}
                                    frequency={point.frequency_hz}
                                    isExport={point.direction_export}
                                    color={getPointColor(point.point_id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-12 text-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-12 h-12 mx-auto text-slate-300 mb-3"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                                />
                            </svg>
                            <p className="text-slate-500">
                                Aucune donnée en temps réel
                            </p>
                        </div>
                    )}

                    {/* SECTION 3 : Graphique d'évolution 24h */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="w-5 h-5 text-emerald-600"
                                        >
                                            <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9A1.5 1.5 0 0 0 9.5 18h1a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10.5 6h-1ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5A1.5 1.5 0 0 0 3.5 18h1A1.5 1.5 0 0 0 6 16.5v-5A1.5 1.5 0 0 0 4.5 10h-1Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-900">
                                            Évolution sur 24h
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Puissance par point de mesure
                                        </p>
                                    </div>
                                </div>
                                {isToday && (
                                    <span className="text-xs text-slate-400">
                                        Heure actuelle:{" "}
                                        {new Date().toLocaleTimeString(
                                            "fr-FR",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="h-72">
                                {loadingGraph ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-amber-500"></div>
                                    </div>
                                ) : (
                                    <PowerChart
                                        measurements={
                                            graphData?.measurements || []
                                        }
                                        colorPalette={COLOR_PALETTE}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4 : Détails par point */}
                    {graphData?.stats?.pointStats &&
                        graphData.stats.pointStats.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="w-5 h-5 text-violet-600"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm4.75 6.75a.75.75 0 0 1 1.5 0v2.546l.943-1.048a.75.75 0 0 1 1.114 1.004l-2.25 2.5a.75.75 0 0 1-1.114 0l-2.25-2.5a.75.75 0 1 1 1.114-1.004l.943 1.048V8.75Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-900">
                                            Détails par point
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Consommation et production du{" "}
                                            {isToday
                                                ? "jour"
                                                : isYesterday
                                                ? "hier"
                                                : selectedDate}
                                        </p>
                                    </div>
                                </div>
                                <PointDetails
                                    pointStats={graphData.stats.pointStats}
                                    currentPoints={points}
                                    colorPalette={COLOR_PALETTE}
                                />
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default App;

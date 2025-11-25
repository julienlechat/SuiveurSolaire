import { useEffect, useState } from "react";
import { fetchLatest, fetchHistoryGraph } from "./api";
import Sidebar from "./components/Sidebar";
import HorizontalGauge from "./components/HorizontalGauge";
import DailyStats from "./components/DailyStats";
import PowerChart from "./components/PowerChart";
import PointKPIs from "./components/PointKPIs";

const REFRESH_MS = Number(import.meta.env.VITE_REFRESH_MS || 5000);

// Palette de couleurs pour les jauges (assignées automatiquement)
const COLOR_PALETTE = [
    "#3b82f6", // Bleu
    "#ef4444", // Rouge
    "#f59e0b", // Orange
    "#10b981", // Vert
    "#8b5cf6", // Violet
    "#ec4899", // Rose
];

// Fonction pour obtenir la couleur d'un point de mesure
function getPointColor(pointId) {
    return COLOR_PALETTE[(pointId - 1) % COLOR_PALETTE.length];
}

// Fonction pour obtenir la puissance max suggérée selon le type
function getSuggestedMaxPower(pointName) {
    const name = pointName.toLowerCase();
    if (
        name.includes("house") ||
        name.includes("maison") ||
        name.includes("logement")
    ) {
        return 5000; // 5kW pour une maison
    }
    if (
        name.includes("water") ||
        name.includes("chauffe") ||
        name.includes("heater")
    ) {
        return 3000; // 3kW pour chauffe-eau
    }
    if (
        name.includes("pv") ||
        name.includes("solar") ||
        name.includes("solaire") ||
        name.includes("production") ||
        name.includes("photovoltaique")
    ) {
        return 3000; // 3kW pour panneaux solaires
    }
    return 3000; // Par défaut
}

function formatNumber(value, digits = 2) {
    if (value === null || value === undefined) return "—";
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return n.toFixed(digits);
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

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <Sidebar connectionStatus={connectionStatus} />

            {/* Contenu principal */}
            <div className="flex-1 overflow-y-auto">
                {/* En-tête */}
                <div className="bg-white border-b px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Tableau de bord
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {lastUpdate
                                    ? `Dernière mise à jour: ${lastUpdate.toLocaleTimeString()}`
                                    : "En attente de données..."}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setSelectedDate(
                                        new Date().toISOString().split("T")[0]
                                    )
                                }
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                                    isToday
                                        ? "bg-neutral-800 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
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
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                                    isYesterday
                                        ? "bg-neutral-800 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
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
                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Contenu scrollable */}
                <div className="p-8 space-y-6">
                    {/* Section 1 : Jauges horizontales temps réel */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5 text-blue-600"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Puissance en temps réel
                            </h2>
                        </div>

                        {loading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-red-800">Erreur: {error}</p>
                            </div>
                        )}

                        {!loading && points.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                Aucune donnée disponible
                            </div>
                        )}

                        {!loading && points.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {points.map((point) => {
                                    const color = getPointColor(point.point_id);
                                    const maxPower = getSuggestedMaxPower(
                                        point.point_name
                                    );

                                    return (
                                        <HorizontalGauge
                                            key={point.point_id}
                                            value={point.power_w}
                                            max={maxPower}
                                            label={point.point_name}
                                            unit="W"
                                            color={color}
                                            voltage={point.voltage_v}
                                            current={point.current_a}
                                            direction={
                                                point.direction_export
                                                    ? "export"
                                                    : "import"
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Section 2 : Statistiques du jour */}
                    {graphData?.stats && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 text-orange-600"
                                >
                                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                                </svg>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Statistiques du{" "}
                                    {isToday
                                        ? "jour"
                                        : isYesterday
                                        ? "hier"
                                        : selectedDate}
                                </h2>
                            </div>

                            <DailyStats stats={graphData.stats} />
                        </div>
                    )}

                    {/* Section 3 : Graphique d'évolution */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5 text-green-600"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
                                    clipRule="evenodd"
                                />
                                <path
                                    fillRule="evenodd"
                                    d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Évolution de la puissance
                            </h2>
                        </div>

                        <div className="h-80">
                            {loadingGraph ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <PowerChart
                                    measurements={graphData?.measurements || []}
                                    colorPalette={COLOR_PALETTE}
                                />
                            )}
                        </div>
                    </div>

                    {/* Section 4 : KPIs détaillés par point */}
                    {graphData?.stats?.pointStats && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 text-purple-600"
                                >
                                    <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                                </svg>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Détails par point de mesure
                                </h2>
                            </div>

                            <PointKPIs
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

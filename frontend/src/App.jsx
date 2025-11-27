import { useEffect, useState, useCallback } from "react";
import { fetchLatest, fetchHistoryGraph, fetchTempo } from "./api";
import Layout from "./components/Layout";
import Header from "./components/Header";
import DailyStats from "./components/DailyStats";
import TempoCard from "./components/TempoCard";
import PowerChart from "./components/PowerChart";

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
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    
    // Données graphique et stats
    const [graphData, setGraphData] = useState(null);
    const [loadingGraph, setLoadingGraph] = useState(true);
    
    // Données Tempo
    const [tempoData, setTempoData] = useState(null);
    const [loadingTempo, setLoadingTempo] = useState(true);

    // Chargement des données temps réel
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

    // Chargement des données graphique quand la date change
    const loadGraphData = useCallback(async (date) => {
        setLoadingGraph(true);
        try {
            const data = await fetchHistoryGraph(date);
            if (data.ok) {
                setGraphData(data);
            }
        } catch (err) {
            console.error("Error loading graph data:", err);
        } finally {
            setLoadingGraph(false);
        }
    }, []);

    useEffect(() => {
        loadGraphData(selectedDate);
    }, [selectedDate, loadGraphData]);

    // Chargement des données Tempo
    useEffect(() => {
        async function loadTempo() {
            try {
                const data = await fetchTempo();
                if (data.ok) {
                    setTempoData(data);
                }
            } catch (err) {
                console.error("Error loading tempo data:", err);
            } finally {
                setLoadingTempo(false);
            }
        }

        loadTempo();
        // Rafraîchir toutes les 5 minutes
        const timer = setInterval(loadTempo, 5 * 60 * 1000);
        return () => clearInterval(timer);
    }, []);

    // Contenu selon la page active
    const renderContent = () => {
        switch (currentPage) {
            case "dashboard":
                return (
                    <>
                        <Header 
                            title="Tableau de bord"
                            lastUpdate={lastUpdate}
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                        />

                        {/* Zone de contenu avec padding */}
                        <div className="p-6">
                            {/* Erreur */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    <p className="font-medium">Erreur de connexion</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            {/* Stats du jour - utilise le point principal (id=1) */}
                            <DailyStats 
                                stats={graphData?.stats}
                                mainPointStats={graphData?.stats?.pointStats?.find(p => p.point_id === 1)}
                                currentPower={points.find(p => p.point_id === 1)?.power_w}
                                loading={loadingGraph} 
                            />

                            {/* Grille principale */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                                {/* Graphique (3 colonnes) */}
                                <div className="lg:col-span-3">
                                    <PowerChart 
                                        measurements={graphData?.measurements}
                                        loading={loadingGraph}
                                    />
                                </div>

                                {/* Carte Tempo (1 colonne) */}
                                <div className="lg:col-span-1">
                                    <TempoCard 
                                        tempoData={tempoData}
                                        loading={loadingTempo}
                                    />
                                </div>
                            </div>

                            {/* Cartes des points de mesure */}
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div 
                                            key={i} 
                                            className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse"
                                        >
                                            <div className="h-4 bg-slate-200 rounded w-2/3 mb-3"></div>
                                            <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
                                            <div className="h-3 bg-slate-200 rounded w-full"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {points.map((p) => (
                                        <div
                                            key={p.point_id}
                                            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                                        >
                                            {/* Header de la carte */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">
                                                        {p.point_name}
                                                    </h3>
                                                    <p className="text-xs text-slate-400">
                                                        Module {p.module}, Ch. {p.channel}
                                                    </p>
                                                </div>
                                                {/* Badge direction */}
                                                <span className={`
                                                    text-xs px-2 py-1 rounded-full font-medium
                                                    ${p.direction_export 
                                                        ? "bg-emerald-50 text-emerald-600" 
                                                        : "bg-blue-50 text-blue-600"
                                                    }
                                                `}>
                                                    {p.direction_export ? "Production" : "Conso."}
                                                </span>
                                            </div>

                                            {/* Puissance */}
                                            <p className="text-3xl font-bold text-slate-800 mb-3">
                                                {formatNumber(p.power_w, 0)}
                                                <span className="text-lg font-normal text-slate-400 ml-1">W</span>
                                            </p>

                                            {/* Détails */}
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="bg-slate-50 rounded-lg px-3 py-2">
                                                    <p className="text-slate-400 text-xs">Tension</p>
                                                    <p className="font-medium text-slate-700">
                                                        {formatNumber(p.voltage_v, 1)} V
                                                    </p>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg px-3 py-2">
                                                    <p className="text-slate-400 text-xs">Courant</p>
                                                    <p className="font-medium text-slate-700">
                                                        {formatNumber(p.current_a, 2)} A
                                                    </p>
                                                </div>
                                            </div>

                                            {/* kWh */}
                                            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <span className="text-slate-400">Import:</span>
                                                    <span className="ml-1 text-slate-600 font-medium">
                                                        {formatNumber(p.import_kwh_total, 3)} kWh
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Export:</span>
                                                    <span className="ml-1 text-slate-600 font-medium">
                                                        {formatNumber(p.export_kwh_total, 3)} kWh
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                );

            case "settings":
                return (
                    <>
                        <Header 
                            title="Réglages"
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                        />
                        <div className="p-6">
                            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                                <p className="text-slate-500">Page en construction...</p>
                            </div>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
            {renderContent()}
        </Layout>
    );
}

export default App;

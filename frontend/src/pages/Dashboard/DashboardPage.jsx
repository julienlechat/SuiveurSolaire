import { useEffect, useState, useCallback } from "react";
import { fetchLatest, fetchHistoryGraph, fetchTempo } from "../../api";
import Header from "../../components/Header";
import DailyStats from "../../components/DailyStats";
import TempoCard from "../../components/TempoCard";
import PowerChart from "../../components/PowerChart";
import PointCard from "../../components/PointCard";

const REFRESH_MS = Number(import.meta.env.VITE_REFRESH_MS || 5000);

export default function DashboardPage() {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    
    // Données graphique et stats
    const [graphData, setGraphData] = useState(null);
    const [loadingGraph, setLoadingGraph] = useState(true);
    
    // Données Tempo
    const [tempoData, setTempoData] = useState(null);
    const [loadingTempo, setLoadingTempo] = useState(true);
    
    // État des cards dépliées (Set d'IDs)
    const [expandedPoints, setExpandedPoints] = useState(new Set());

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

                {/* Grille principale - hauteur alignée */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                    {/* Graphique (3 colonnes) */}
                    <div className="lg:col-span-3 min-h-[400px] lg:min-h-0">
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
                                className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse"
                            >
                                <div className="h-4 bg-slate-200 rounded w-2/3 mb-3"></div>
                                <div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                        {points.map((p, index) => (
                            <PointCard
                                key={p.point_id}
                                point={p}
                                stats={graphData?.stats?.pointStats?.find(
                                    (s) => s.point_id === p.point_id
                                )}
                                index={index}
                                isExpanded={expandedPoints.has(p.point_id)}
                                onToggle={() => {
                                    setExpandedPoints(prev => {
                                        const next = new Set(prev);
                                        if (next.has(p.point_id)) {
                                            next.delete(p.point_id);
                                        } else {
                                            next.add(p.point_id);
                                        }
                                        return next;
                                    });
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}


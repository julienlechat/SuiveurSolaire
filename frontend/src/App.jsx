import { useEffect, useState } from "react";
import { fetchLatest } from "./api";
import Sidebar from "./components/Sidebar";
import PowerGauge from "./components/PowerGauge";
import StatsCard from "./components/StatsCard";

const REFRESH_MS = Number(import.meta.env.VITE_REFRESH_MS || 5000);

// Mapping des points de mesure
const POINT_CONFIG = {
    'House': {
        label: 'Energie Logement',
        color: '#3b82f6',
        maxPower: 5000
    },
    'WaterHeater': {
        label: 'Energie Chauffe-eau',
        color: '#ef4444',
        maxPower: 3000
    },
    'PV': {
        label: 'Energie Produite',
        color: '#f59e0b',
        maxPower: 3000
    },
    'Spare': {
        label: 'Spare',
        color: '#8b5cf6',
        maxPower: 3000
    }
};

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
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    useEffect(() => {
        let timer;

        async function load() {
            try {
                setError(null);
                const data = await fetchLatest();
                if (data.ok) {
                    setPoints(data.points || []);
                    setLastUpdate(new Date());
                    setConnectionStatus('connected');
                } else {
                    setError(data.error || "Erreur inconnue");
                    setConnectionStatus('disconnected');
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
                setConnectionStatus('disconnected');
            } finally {
                setLoading(false);
            }
        }

        load();
        timer = setInterval(load, REFRESH_MS);

        return () => clearInterval(timer);
    }, []);

    // Calculer les statistiques du jour (simulées pour le moment)
    const calculateDailyStats = () => {
        if (points.length === 0) return null;

        const housePoint = points.find(p => p.point_name === 'House');
        const pvPoint = points.find(p => p.point_name === 'PV');

        const consumption = housePoint ? parseFloat(housePoint.import_kwh_total || 0) : 0;
        const production = pvPoint ? parseFloat(pvPoint.export_kwh_total || 0) : 0;
        const cost = consumption * 0.18; // Prix moyen au kWh
        const savings = production * 0.13; // Prix de rachat

        return { consumption, production, cost, savings };
    };

    const dailyStats = calculateDailyStats();

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
                            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {lastUpdate 
                                    ? `Dernière mise à jour: ${lastUpdate.toLocaleTimeString()}`
                                    : 'En attente de données...'
                                }
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-neutral-800 text-white text-sm font-medium rounded-lg hover:bg-neutral-700">
                                Aujourd'hui
                            </button>
                            <button className="px-4 py-2 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100">
                                Hier
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenu scrollable */}
                <div className="p-8">
                    {/* Section des jauges de puissance temps réel */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex items-center gap-2 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                                <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                            </svg>
                            <h2 className="text-lg font-semibold text-gray-900">Puissance en temps réel</h2>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                                {points.map((point) => {
                                    const config = POINT_CONFIG[point.point_name] || {
                                        label: point.point_name,
                                        color: '#6b7280',
                                        maxPower: 3000
                                    };

                                    return (
                                        <div key={point.point_id} className="flex flex-col items-center">
                                            <PowerGauge
                                                value={point.power_w}
                                                max={config.maxPower}
                                                label={config.label}
                                                unit="W"
                                                color={config.color}
                                                direction={point.direction_export ? 'export' : 'import'}
                                            />
                                            <div className="mt-4 space-y-1 text-center">
                                                <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                                                    <div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 inline mr-1 text-blue-500">
                                                            <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                                                            <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                                                        </svg>
                                                        {formatNumber(point.voltage_v, 1)} V
                                                    </div>
                                                    <div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 inline mr-1 text-yellow-500">
                                                            <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                                                        </svg>
                                                        {formatNumber(point.current_a, 2)} A
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Section des statistiques du jour */}
                    {dailyStats && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-600">
                                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                                </svg>
                                <h2 className="text-lg font-semibold text-gray-900">Statistiques du jour</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatsCard
                                    title="COÛT"
                                    value={formatNumber(dailyStats.cost, 2)}
                                    unit="€"
                                    color="blue"
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                />

                                <StatsCard
                                    title="CONSOMMATION"
                                    value={formatNumber(dailyStats.consumption, 2)}
                                    unit="kWh"
                                    color="red"
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                />

                                <StatsCard
                                    title="PRODUCTION"
                                    value={formatNumber(dailyStats.production, 2)}
                                    unit="kWh"
                                    color="yellow"
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
                                        </svg>
                                    }
                                />

                                <StatsCard
                                    title="ÉCONOMIE"
                                    value={formatNumber(dailyStats.savings, 2)}
                                    unit="€"
                                    color="green"
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
                                            <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;

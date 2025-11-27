import { useEffect, useState } from "react";
import { fetchLatest } from "./api";
import Layout from "./components/Layout";
import Header from "./components/Header";

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

    // Contenu selon la page active
    const renderContent = () => {
        switch (currentPage) {
            case "dashboard":
                return (
                    <>
                        <Header 
                            title="Tableau de bord"
                            subtitle={`${points.length} points de mesure`}
                            lastUpdate={lastUpdate}
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                        />

                        {/* Erreur */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                <p className="font-medium">Erreur de connexion</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
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
                        )}

                        {/* Cartes des points de mesure */}
                        {!loading && (
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
                                                {p.direction_export ? "Production" : "Consommation"}
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
                    </>
                );

            case "history":
                return (
                    <>
                        <Header 
                            title="Historique"
                            subtitle="Consultez vos données passées"
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                        />
                        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                            <p className="text-slate-500">Page en construction...</p>
                        </div>
                    </>
                );

            case "analytics":
                return (
                    <>
                        <Header 
                            title="Analytique"
                            subtitle="Analyses et statistiques"
                        />
                        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                            <p className="text-slate-500">Page en construction...</p>
                        </div>
                    </>
                );

            case "settings":
                return (
                    <>
                        <Header 
                            title="Paramètres"
                            subtitle="Configuration de l'application"
                        />
                        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                            <p className="text-slate-500">Page en construction...</p>
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

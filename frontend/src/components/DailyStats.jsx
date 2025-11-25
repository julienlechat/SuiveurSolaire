/**
 * Statistiques globales du jour
 * Utilise les stats du point principal (maison) pour les valeurs principales
 */
export default function DailyStats({ stats, mainPointStats, loading, totalPowerNow, selectedDate, isToday }) {
    const formatNumber = (value, decimals = 2) => {
        if (value === null || value === undefined) return "—";
        const n = Number(value);
        if (Number.isNaN(n)) return "—";
        return n.toFixed(decimals);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "—";
        const date = new Date(timestamp);
        return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Skeleton loading
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                        <div className="h-8 w-8 bg-slate-200 rounded-lg mb-3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Utiliser les stats du point maison (id 1) si disponible, sinon les stats globales
    const totalConsumption = mainPointStats?.import_kwh ?? stats?.totalConsumption ?? 0;
    const totalProduction = mainPointStats?.export_kwh ?? stats?.totalProduction ?? 0;
    const estimatedCost = (mainPointStats?.import_kwh ?? stats?.totalConsumption ?? 0) * (stats?.pricePerKwh ?? 0.18);
    const averagePower = mainPointStats?.avg_power ?? stats?.averagePower ?? 0;
    const maxPower = mainPointStats?.max_power ?? stats?.maxPower ?? 0;
    const maxPowerTime = stats?.maxPowerTime;
    const measurementCount = mainPointStats?.measurement_count ?? 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Puissance actuelle */}
            {isToday && (
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-600">
                            <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                        </svg>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mb-1">MAINTENANT</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-900">{formatNumber(totalPowerNow, 0)}</span>
                        <span className="text-sm text-slate-500">W</span>
                    </div>
                </div>
            )}

            {/* Consommation totale - icône flèche vers le bas */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-600">
                        <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1">CONSOMMÉ</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">{formatNumber(totalConsumption, 2)}</span>
                    <span className="text-sm text-slate-500">kWh</span>
                </div>
                {measurementCount > 0 && (
                    <p className="text-xs text-slate-400 mt-1">{measurementCount} mesures</p>
                )}
            </div>

            {/* Coût estimé - icône euro */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-purple-600">
                        <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 0 0-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152Z" />
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-6a.75.75 0 0 1 .75.75v.316a3.78 3.78 0 0 1 1.653.713c.426.33.744.74.925 1.2a.75.75 0 0 1-1.395.55 1.35 1.35 0 0 0-.447-.563 2.187 2.187 0 0 0-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 1 1-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 1 1 1.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 0 1-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 0 1 1.653-.713V4.75A.75.75 0 0 1 10 4Z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1">COÛT</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">{formatNumber(estimatedCost, 2)}</span>
                    <span className="text-sm text-slate-500">€</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">@ {formatNumber(stats?.pricePerKwh ?? 0.18, 2)}€/kWh</p>
            </div>

            {/* Puissance moyenne - icône onde */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0 4 3 6 0" />
                    </svg>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1">MOYENNE</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">{formatNumber(averagePower, 0)}</span>
                    <span className="text-sm text-slate-500">W</span>
                </div>
            </div>

            {/* Pic de puissance - icône montagne */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-orange-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 20l5-10 4 6 5-12 6 16" />
                    </svg>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1">PIC</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">{formatNumber(maxPower, 0)}</span>
                    <span className="text-sm text-slate-500">W</span>
                </div>
                {maxPowerTime && (
                    <p className="text-xs text-slate-400 mt-1">à {formatTime(maxPowerTime)}</p>
                )}
            </div>
        </div>
    );
}

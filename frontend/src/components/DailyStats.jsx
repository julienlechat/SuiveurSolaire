/**
 * Statistiques globales du jour
 * Affichées en premier, design élégant avec icônes
 */
export default function DailyStats({ stats, loading, totalPowerNow, selectedDate, isToday }) {
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                        <div className="h-8 w-8 bg-slate-200 rounded-lg mb-3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Calculs avec valeurs par défaut
    const totalConsumption = stats?.totalConsumption || 0;
    const totalProduction = stats?.totalProduction || 0;
    const estimatedCost = stats?.estimatedCost || 0;
    const estimatedRevenue = stats?.estimatedRevenue || 0;
    const averagePower = stats?.averagePower || 0;
    const maxPower = stats?.maxPower || 0;
    const maxPowerTime = stats?.maxPowerTime;

    // Bilan net (production - consommation)
    const netBalance = totalProduction - totalConsumption;
    const netCost = estimatedCost - estimatedRevenue;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

            {/* Consommation totale */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-600">
                        <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765 4.5 4.5 0 0 1 8.302-3.046 3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm5.25-9.25a.75.75 0 0 0-1.5 0v4.59l-1.95-2.1a.75.75 0 1 0-1.1 1.02l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V7.75Z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1">CONSOMMÉ</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">{formatNumber(totalConsumption, 2)}</span>
                    <span className="text-sm text-slate-500">kWh</span>
                </div>
            </div>

            {/* Production totale */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-600">
                        <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765 4.5 4.5 0 0 1 8.302-3.046 3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1">PRODUIT</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">{formatNumber(totalProduction, 2)}</span>
                    <span className="text-sm text-slate-500">kWh</span>
                </div>
            </div>

            {/* Coût estimé */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-purple-600">
                        <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 0 0-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152Z" />
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-6a.75.75 0 0 1 .75.75v.316a3.78 3.78 0 0 1 1.653.713c.426.33.744.74.925 1.2a.75.75 0 0 1-1.395.55 1.35 1.35 0 0 0-.447-.563 2.187 2.187 0 0 0-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 1 1-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 1 1 1.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 0 1-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 0 1 1.653-.713V4.75A.75.75 0 0 1 10 4Z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1">COÛT</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">{formatNumber(netCost, 2)}</span>
                    <span className="text-sm text-slate-500">€</span>
                </div>
                {totalProduction > 0 && (
                    <p className="text-xs text-emerald-600 mt-1">
                        -{formatNumber(estimatedRevenue, 2)}€ produit
                    </p>
                )}
            </div>

            {/* Puissance moyenne */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-600">
                        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1">MOYENNE</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">{formatNumber(averagePower, 0)}</span>
                    <span className="text-sm text-slate-500">W</span>
                </div>
            </div>

            {/* Pic de puissance */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-600">
                        <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 0 1 .919-.53l4.78 1.281a.75.75 0 0 1 .531.919l-1.281 4.78a.75.75 0 0 1-1.449-.387l.81-3.022a19.407 19.407 0 0 0-5.594 5.203.75.75 0 0 1-1.139.093L7 10.06l-4.72 4.72a.75.75 0 0 1-1.06-1.061l5.25-5.25a.75.75 0 0 1 1.06 0l3.074 3.073a20.923 20.923 0 0 1 5.545-4.931l-3.042-.815a.75.75 0 0 1-.53-.919Z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1">PIC</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">{formatNumber(maxPower, 0)}</span>
                    <span className="text-sm text-slate-500">W</span>
                </div>
                {maxPowerTime && (
                    <p className="text-xs text-slate-400 mt-1">
                        à {formatTime(maxPowerTime)}
                    </p>
                )}
            </div>
        </div>
    );
}

/**
 * Détails par point de mesure
 * Design élégant avec cards compactes
 */
export default function PointDetails({ pointStats = [], currentPoints = [], colorPalette = [] }) {
    const formatNumber = (value, decimals = 1) => {
        if (value === null || value === undefined) return "—";
        const n = Number(value);
        if (Number.isNaN(n)) return "—";
        return n.toFixed(decimals);
    };

    // Fusionner les stats historiques avec les données temps réel
    const enrichedStats = pointStats.map((stat) => {
        const currentData = currentPoints.find(
            (p) => p.point_id === stat.point_id
        );
        const color = colorPalette[(stat.point_id - 1) % colorPalette.length] || "#6b7280";

        return {
            ...stat,
            current_power: currentData?.power_w || 0,
            current_voltage: currentData?.voltage_v || null,
            current_amperage: currentData?.current_a || null,
            power_factor: currentData?.power_factor || null,
            color,
        };
    });

    if (enrichedStats.length === 0) {
        return (
            <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-slate-500">Aucune donnée disponible</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {enrichedStats.map((point) => (
                <div
                    key={point.point_id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                    {/* Barre de couleur */}
                    <div className="h-1" style={{ backgroundColor: point.color }}></div>
                    
                    <div className="p-5">
                        {/* En-tête */}
                        <div className="flex items-center gap-2 mb-4">
                            <div 
                                className="w-2.5 h-2.5 rounded-full" 
                                style={{ backgroundColor: point.color }}
                            ></div>
                            <h3 className="font-semibold text-slate-800 text-sm truncate">
                                {point.point_name}
                            </h3>
                        </div>

                        {/* Puissance actuelle */}
                        <div className="mb-4">
                            <p className="text-xs text-slate-500 mb-1">Puissance actuelle</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-slate-900">
                                    {formatNumber(point.current_power, 0)}
                                </span>
                                <span className="text-sm text-slate-500">W</span>
                            </div>
                        </div>

                        {/* Stats du jour */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            {/* Consommation (Import) */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-red-500">
                                            <path fillRule="evenodd" d="M8 1a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5A.75.75 0 0 1 8 1ZM4.11 3.05a.75.75 0 0 1 0 1.06 5.5 5.5 0 1 0 7.78 0 .75.75 0 0 1 1.06-1.06 7 7 0 1 1-9.9 0 .75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-slate-600">Consommé</span>
                                </div>
                                <span className="text-sm font-semibold text-slate-800">
                                    {formatNumber(point.import_kwh, 2)} <span className="text-slate-400 font-normal">kWh</span>
                                </span>
                            </div>

                            {/* Production (Export) */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-emerald-500">
                                            <path d="M10 3a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5A.75.75 0 0 1 10 3ZM10 1a2 2 0 0 0-1.907 1.406A6.993 6.993 0 0 0 3 9a7 7 0 0 0 14 0 6.993 6.993 0 0 0-5.093-6.594A2 2 0 0 0 10 1Z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-slate-600">Produit</span>
                                </div>
                                <span className="text-sm font-semibold text-slate-800">
                                    {formatNumber(point.export_kwh, 2)} <span className="text-slate-400 font-normal">kWh</span>
                                </span>
                            </div>

                            {/* Moyenne */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-blue-500">
                                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 .3.6l2.5 1.875a.75.75 0 0 0 .9-1.2L8.75 8.625V4.75Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-slate-600">Moyenne</span>
                                </div>
                                <span className="text-sm font-semibold text-slate-800">
                                    {formatNumber(point.avg_power, 0)} <span className="text-slate-400 font-normal">W</span>
                                </span>
                            </div>

                            {/* Max */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-orange-500">
                                            <path fillRule="evenodd" d="M7.628 1.099a.75.75 0 0 1 .744 0l5.25 3a.75.75 0 0 1 0 1.302l-5.25 3a.75.75 0 0 1-.744 0l-5.25-3a.75.75 0 0 1 0-1.302l5.25-3Zm-.529 8.132L3.11 6.742l-1.738.992a.75.75 0 0 0 0 1.302l5.25 3a.75.75 0 0 0 .744 0l5.25-3a.75.75 0 0 0 0-1.302l-1.738-.992-3.99 2.28a.75.75 0 0 1-.744 0Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-slate-600">Pic</span>
                                </div>
                                <span className="text-sm font-semibold text-slate-800">
                                    {formatNumber(point.max_power, 0)} <span className="text-slate-400 font-normal">W</span>
                                </span>
                            </div>
                        </div>

                        {/* Métriques temps réel */}
                        {(point.current_voltage !== null || point.current_amperage !== null) && (
                            <div className="mt-4 pt-3 border-t border-slate-100">
                                <div className="flex items-center justify-between text-xs">
                                    {point.current_voltage !== null && (
                                        <span className="text-slate-500">
                                            <span className="font-medium text-slate-700">{formatNumber(point.current_voltage, 1)}</span> V
                                        </span>
                                    )}
                                    {point.current_amperage !== null && (
                                        <span className="text-slate-500">
                                            <span className="font-medium text-slate-700">{formatNumber(point.current_amperage, 2)}</span> A
                                        </span>
                                    )}
                                    {point.power_factor !== null && (
                                        <span className="text-slate-500">
                                            PF <span className="font-medium text-slate-700">{formatNumber(point.power_factor, 2)}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}


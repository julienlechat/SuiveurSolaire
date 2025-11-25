/**
 * KPIs détaillés par point de mesure
 * Affiche : Consommation, Moyenne, Max, Min
 */
export default function PointKPIs({ pointStats = [], currentPoints = [], colorPalette = [] }) {
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
            current_voltage: currentData?.voltage_v || 0,
            current_amperage: currentData?.current_a || 0,
            color,
        };
    });

    if (enrichedStats.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Aucune donnée disponible</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrichedStats.map((point) => (
                <div
                    key={point.point_id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                    {/* En-tête avec nom du point */}
                    <div className="flex items-center gap-2 mb-4">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: point.color }}
                        ></div>
                        <h3 className="font-semibold text-gray-900">
                            {point.point_name}
                        </h3>
                    </div>

                    {/* Grille de KPIs */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Puissance actuelle */}
                        <div className="bg-blue-50 rounded p-3">
                            <div className="text-xs text-blue-700 font-medium mb-1">
                                ACTUEL
                            </div>
                            <div className="text-xl font-bold text-blue-900">
                                {formatNumber(point.current_power, 0)}
                                <span className="text-sm font-normal text-blue-700 ml-1">
                                    W
                                </span>
                            </div>
                        </div>

                        {/* Import (Consommation) */}
                        <div className="bg-red-50 rounded p-3">
                            <div className="text-xs text-red-700 font-medium mb-1">
                                IMPORT
                            </div>
                            <div className="text-xl font-bold text-red-900">
                                {formatNumber(point.import_kwh, 2)}
                                <span className="text-sm font-normal text-red-700 ml-1">
                                    kWh
                                </span>
                            </div>
                        </div>

                        {/* Export (Production) */}
                        <div className="bg-yellow-50 rounded p-3">
                            <div className="text-xs text-yellow-700 font-medium mb-1">
                                EXPORT
                            </div>
                            <div className="text-xl font-bold text-yellow-900">
                                {formatNumber(point.export_kwh, 2)}
                                <span className="text-sm font-normal text-yellow-700 ml-1">
                                    kWh
                                </span>
                            </div>
                        </div>

                        {/* Moyenne */}
                        <div className="bg-green-50 rounded p-3">
                            <div className="text-xs text-green-700 font-medium mb-1">
                                MOYENNE
                            </div>
                            <div className="text-xl font-bold text-green-900">
                                {formatNumber(point.avg_power, 0)}
                                <span className="text-sm font-normal text-green-700 ml-1">
                                    W
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Détails tension/courant */}
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3 h-3 text-blue-500"
                            >
                                <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
                            </svg>
                            <span>
                                {formatNumber(point.current_voltage, 1)} V
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3 h-3 text-yellow-500"
                            >
                                <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                            </svg>
                            <span>
                                {formatNumber(point.current_amperage, 2)} A
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}


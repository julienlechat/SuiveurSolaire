// Composant des statistiques journalières
export default function DailyStats({ stats, mainPointStats, currentPower, loading }) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 animate-pulse">
                        <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                        <div className="h-5 sm:h-6 bg-slate-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Stats du point principal
    const consumption = mainPointStats?.import_kwh ?? stats?.totalConsumption ?? 0;
    const production = mainPointStats?.export_kwh ?? stats?.totalProduction ?? 0;
    const avgPower = mainPointStats?.avg_power ?? stats?.averagePower ?? 0;
    const maxPower = mainPointStats?.max_power ?? 0;
    const pricePerKwh = 0.18;
    const estimatedCost = consumption * pricePerKwh;

    const items = [
        {
            label: "Maintenant",
            value: currentPower != null ? Number(currentPower).toFixed(0) : "—",
            unit: "W",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            highlight: true,
        },
        {
            label: "Consommé",
            value: consumption.toFixed(2),
            unit: "kWh",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            ),
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            label: "Produit",
            value: production.toFixed(2),
            unit: "kWh",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            ),
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            label: "Coût",
            value: estimatedCost.toFixed(2),
            unit: "€",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "text-rose-600",
            bgColor: "bg-rose-50",
        },
        {
            label: "Moyenne",
            value: avgPower.toFixed(0),
            unit: "W",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            label: "Pic",
            value: maxPower.toFixed(0),
            unit: "W",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-6">
            {items.map((item, index) => (
                <div 
                    key={index} 
                    className={`
                        bg-white rounded-xl border p-3 sm:p-4 hover:shadow-md transition-shadow
                        ${item.highlight ? "border-amber-200 ring-1 ring-amber-100" : "border-slate-200"}
                    `}
                >
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <div className={`p-1 sm:p-1.5 rounded-lg ${item.bgColor} ${item.color}`}>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {item.icon.props.children}
                            </svg>
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide truncate">
                            {item.label}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-0.5 sm:gap-1">
                        <span className={`text-xl sm:text-2xl font-bold ${item.highlight ? "text-amber-600" : "text-gray-900"}`}>
                            {item.value}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">{item.unit}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Composant des statistiques journalières
export default function DailyStats({ stats, loading }) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                        <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    const items = [
        {
            label: "Consommé",
            value: stats?.totalConsumption?.toFixed(2) || "0.00",
            unit: "kWh",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            ),
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
        {
            label: "Produit",
            value: stats?.totalProduction?.toFixed(2) || "0.00",
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
            label: "Coût estimé",
            value: stats?.estimatedCost?.toFixed(2) || "0.00",
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
            label: "Revenu estimé",
            value: stats?.estimatedRevenue?.toFixed(2) || "0.00",
            unit: "€",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            label: "Puissance moy.",
            value: stats?.averagePower?.toFixed(0) || "0",
            unit: "W",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            label: "Pic puissance",
            value: Math.max(...(stats?.pointStats?.map(p => p.max_power) || [0])).toFixed(0),
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {items.map((item, index) => (
                <div 
                    key={index} 
                    className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${item.bgColor} ${item.color}`}>
                            {item.icon}
                        </div>
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                            {item.label}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                            {item.value}
                        </span>
                        <span className="text-sm text-gray-500">{item.unit}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}


// Carte d'un point de mesure
export default function PointCard({ point, stats }) {
    const power = Number(point?.power_w) || 0;
    const voltage = Number(point?.voltage_v) || 0;
    const current = Number(point?.current_a) || 0;
    const powerFactor = Number(point?.power_factor) || 0;
    
    const consumed = Number(stats?.import_kwh) || 0;
    const produced = Number(stats?.export_kwh) || 0;
    const avgPower = Number(stats?.avg_power) || 0;
    const maxPower = Number(stats?.max_power) || 0;

    const metrics = [
        {
            label: "Consommé",
            value: consumed.toFixed(2),
            unit: "kWh",
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            ),
            color: "text-orange-500",
            bg: "bg-orange-50",
        },
        {
            label: "Produit",
            value: produced.toFixed(2),
            unit: "kWh",
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            ),
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
        {
            label: "Moyenne",
            value: avgPower.toFixed(0),
            unit: "W",
            icon: (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0 4 3 6 0" />
                </svg>
            ),
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            label: "Pic",
            value: maxPower.toFixed(0),
            unit: "W",
            icon: (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 20l5-10 4 6 5-12 6 16" />
                </svg>
            ),
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{point?.point_name || "—"}</h3>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    M{point?.module} Ch.{point?.channel}
                </span>
            </div>

            {/* Puissance actuelle */}
            <div className="mb-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Puissance actuelle</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{power.toFixed(0)}</span>
                    <span className="text-lg text-gray-500">W</span>
                </div>
            </div>

            {/* Métriques journalières */}
            <div className="space-y-2 mb-4">
                {metrics.map((m, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${m.bg} ${m.color}`}>
                                {m.icon}
                            </div>
                            <span className="text-xs text-gray-600">{m.label}</span>
                        </div>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-sm font-semibold text-gray-900">{m.value}</span>
                            <span className="text-[10px] text-gray-400">{m.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer - Mesures électriques */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
                <div className="flex-1 flex items-center gap-1.5 bg-blue-50 rounded-lg px-2 py-1.5">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M5.5 8h13M6 8v5a6 6 0 0012 0V8" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">{voltage.toFixed(0)}</span>
                    <span className="text-[9px] text-gray-400">V</span>
                </div>
                <div className="flex-1 flex items-center gap-1.5 bg-amber-50 rounded-lg px-2 py-1.5">
                    <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">{current.toFixed(2)}</span>
                    <span className="text-[9px] text-gray-400">A</span>
                </div>
            </div>
        </div>
    );
}


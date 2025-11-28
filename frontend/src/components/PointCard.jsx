// Couleurs pour les numéros de points (style KPI : fond clair + texte foncé)
const POINT_COLORS = [
    { bg: "bg-blue-100", text: "text-blue-600" },
    { bg: "bg-rose-100", text: "text-rose-600" },
    { bg: "bg-emerald-100", text: "text-emerald-600" },
    { bg: "bg-purple-100", text: "text-purple-600" },
];

// Carte d'un point de mesure (collapsible, état géré par parent)
export default function PointCard({ point, stats, index = 0, isExpanded = false, onToggle }) {
    const power = Number(point?.power_w) || 0;
    const voltage = Number(point?.voltage_v) || 0;
    const current = Number(point?.current_a) || 0;
    
    const consumed = Number(stats?.import_kwh) || 0;
    const produced = Number(stats?.export_kwh) || 0;
    const avgPower = Number(stats?.avg_power) || 0;
    const maxPower = Number(stats?.max_power) || 0;
    
    // Couleur basée sur l'index
    const pointColor = POINT_COLORS[index % POINT_COLORS.length];

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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
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
        {
            label: "Tension",
            value: voltage.toFixed(0),
            unit: "V",
            icon: (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M5.5 8h13M6 8v5a6 6 0 0012 0V8" />
                </svg>
            ),
            color: "text-slate-500",
            bg: "bg-slate-50",
        },
        {
            label: "Courant",
            value: current.toFixed(2),
            unit: "A",
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
            {/* Header cliquable */}
            <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg ${pointColor.bg} ${pointColor.text} flex items-center justify-center text-sm font-bold`}>
                        {index + 1}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{point?.point_name || "—"}</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900">{power.toFixed(0)}</span>
                            <span className="text-sm text-gray-500">W</span>
                        </div>
                    </div>
                </div>
                <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Contenu dépliable */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                    {/* Module/Channel info */}
                    <div className="py-2 mb-2">
                        <span className="text-[10px] text-gray-400">
                            Module {point?.module} • Channel {point?.channel}
                        </span>
                    </div>
                    
                    {/* Métriques - grille 2 colonnes */}
                    <div className="grid grid-cols-2 gap-2">
                        {metrics.map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-1.5">
                                    <div className={`p-1 rounded ${m.bg} ${m.color}`}>
                                        {m.icon}
                                    </div>
                                    <span className="text-[10px] text-gray-500">{m.label}</span>
                                </div>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-xs font-semibold text-gray-900">{m.value}</span>
                                    <span className="text-[9px] text-gray-400">{m.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

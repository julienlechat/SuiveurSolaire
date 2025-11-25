/**
 * Card de mesure d'énergie en temps réel
 * Design moderne avec accent "électricité"
 */
export default function EnergyCard({
    name = "Point",
    power = 0,
    voltage = null,
    current = null,
    powerFactor = null,
    frequency = null,
    isExport = false,
    color = "#3b82f6",
}) {
    const formatValue = (val, decimals = 1) => {
        if (val === null || val === undefined) return "—";
        return Number(val).toFixed(decimals);
    };

    // Déterminer si c'est de la consommation ou production
    const isProduction = isExport || power < 0;
    const displayPower = Math.abs(power);

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* Barre de couleur en haut */}
            <div className="h-1" style={{ backgroundColor: color }}></div>
            
            <div className="p-5">
                {/* En-tête : Nom + Badge */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: color }}
                        ></div>
                        <h3 className="font-semibold text-slate-800 text-sm">{name}</h3>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isProduction 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-amber-50 text-amber-700'
                    }`}>
                        {isProduction ? '⚡ Production' : '🔌 Consommation'}
                    </span>
                </div>

                {/* Puissance principale */}
                <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900">
                            {formatValue(displayPower, 0)}
                        </span>
                        <span className="text-lg text-slate-500 font-medium">W</span>
                    </div>
                </div>

                {/* Métriques secondaires */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                    {/* Tension */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-600">
                                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Tension</div>
                            <div className="text-sm font-semibold text-slate-700">
                                {formatValue(voltage, 1)} <span className="text-slate-400 font-normal">V</span>
                            </div>
                        </div>
                    </div>

                    {/* Courant */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-600">
                                <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Courant</div>
                            <div className="text-sm font-semibold text-slate-700">
                                {formatValue(current, 2)} <span className="text-slate-400 font-normal">A</span>
                            </div>
                        </div>
                    </div>

                    {/* Facteur de puissance (si disponible) */}
                    {powerFactor !== null && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-purple-600">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500">Cos φ</div>
                                <div className="text-sm font-semibold text-slate-700">
                                    {formatValue(powerFactor, 2)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Fréquence (si disponible) */}
                    {frequency !== null && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-600">
                                    <path fillRule="evenodd" d="M1 2.75A.75.75 0 0 1 1.75 2h16.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 14.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1-.75-.75ZM2.75 8a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM7 8.75A.75.75 0 0 1 7.75 8h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 8.75Zm4 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Zm4.75-.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM2 12.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM6.75 11.5a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Zm3.25.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Zm4.75-.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500">Fréquence</div>
                                <div className="text-sm font-semibold text-slate-700">
                                    {formatValue(frequency, 1)} <span className="text-slate-400 font-normal">Hz</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


/**
 * Card de mesure d'énergie en temps réel
 * Design moderne avec accent "électricité"
 */
export default function EnergyCard({
    name = "Point",
    power = 0,
    voltage = null,
    current = null,
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
                        {isProduction ? '↑ Production' : '↓ Consommation'}
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
                    {/* Tension - icône prise électrique */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-blue-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M5.5 8h13M6 8v5a6 6 0 0012 0V8" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Tension</div>
                            <div className="text-sm font-semibold text-slate-700">
                                {formatValue(voltage, 1)} <span className="text-slate-400 font-normal">V</span>
                            </div>
                        </div>
                    </div>

                    {/* Courant - icône éclair */}
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

                    {/* Fréquence (si disponible) - icône onde */}
                    {frequency !== null && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-emerald-600">
                                    <path d="M2 12h2l2-7 3 14 3-14 2 7h8" />
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

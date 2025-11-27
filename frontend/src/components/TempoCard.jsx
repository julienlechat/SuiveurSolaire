// Carte Tempo EDF
export default function TempoCard({ tempoData, loading }) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
        );
    }

    if (!tempoData) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-amber-500">⚡</span>
                    <span className="font-semibold text-gray-900">Tempo EDF</span>
                </div>
                <p className="text-sm text-gray-500">
                    Aucun contrat Tempo configuré
                </p>
            </div>
        );
    }

    const colorStyles = {
        BLEU: { bg: "bg-sky-100", text: "text-sky-700", dot: "bg-sky-500", label: "Bleu" },
        BLANC: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400", label: "Blanc" },
        ROUGE: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Rouge" },
    };

    const todayStyle = colorStyles[tempoData.todayColor] || colorStyles.BLEU;
    const tomorrowStyle = colorStyles[tempoData.tomorrowColor];

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-amber-500">⚡</span>
                    <span className="font-semibold text-gray-900">Tempo EDF</span>
                </div>
                {tempoData.isHeuresCreuses !== null && (
                    <span className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${tempoData.isHeuresCreuses 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-amber-100 text-amber-700"
                        }
                    `}>
                        {tempoData.isHeuresCreuses ? "Heures creuses" : "Heures pleines"}
                    </span>
                )}
            </div>

            {/* Couleur du jour */}
            <div className="flex items-center gap-4 mb-4">
                <div className={`px-4 py-2 rounded-lg ${todayStyle.bg}`}>
                    <p className="text-xs text-gray-500 mb-0.5">Aujourd'hui</p>
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${todayStyle.dot}`}></span>
                        <span className={`font-bold text-lg ${todayStyle.text}`}>
                            {todayStyle.label}
                        </span>
                    </div>
                </div>

                {tomorrowStyle && (
                    <div className={`px-4 py-2 rounded-lg ${tomorrowStyle.bg}`}>
                        <p className="text-xs text-gray-500 mb-0.5">Demain</p>
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${tomorrowStyle.dot}`}></span>
                            <span className={`font-bold text-lg ${tomorrowStyle.text}`}>
                                {tomorrowStyle.label}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Tarif actuel */}
            {tempoData.tarifActuel && (
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Tarif actuel</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-gray-900">
                            {(tempoData.tarifActuel * 100).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">c€/kWh</span>
                    </div>
                    {tempoData.libelleTarif && (
                        <p className="text-xs text-gray-400 mt-1">{tempoData.libelleTarif}</p>
                    )}
                </div>
            )}

            {/* Jours restants */}
            {tempoData.stats && (
                <div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">Jours restants</p>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-sky-50 rounded-lg">
                            <span className="block text-lg font-bold text-sky-700">
                                {tempoData.stats.joursBleuRestants}
                            </span>
                            <span className="text-xs text-sky-600">Bleu</span>
                        </div>
                        <div className="text-center p-2 bg-gray-100 rounded-lg">
                            <span className="block text-lg font-bold text-gray-700">
                                {tempoData.stats.joursBlancRestants}
                            </span>
                            <span className="text-xs text-gray-600">Blanc</span>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded-lg">
                            <span className="block text-lg font-bold text-red-700">
                                {tempoData.stats.joursRougeRestants}
                            </span>
                            <span className="text-xs text-red-600">Rouge</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


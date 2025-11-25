/**
 * Composant pour afficher les informations Tempo EDF
 * Affiche la couleur du jour, de demain, les heures HP/HC et les jours restants
 */
export default function TempoCard({ tempoData, loading }) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="flex gap-4">
                    <div className="h-16 bg-slate-200 rounded flex-1"></div>
                    <div className="h-16 bg-slate-200 rounded flex-1"></div>
                </div>
            </div>
        );
    }

    if (!tempoData || tempoData.contractType !== "TEMPO") {
        return null; // Ne rien afficher si pas en contrat Tempo
    }

    const { 
        todayColor, 
        tomorrowColor, 
        isPeakHour, 
        peakHourStart, 
        peakHourEnd,
        remainingDays 
    } = tempoData;

    // Couleurs Tempo
    const getColorStyles = (color) => {
        switch (color) {
            case 'BLEU':
                return { bg: 'bg-blue-500', text: 'text-blue-600', bgLight: 'bg-blue-50', label: 'Bleu' };
            case 'BLANC':
                return { bg: 'bg-slate-200', text: 'text-slate-600', bgLight: 'bg-slate-50', label: 'Blanc' };
            case 'ROUGE':
                return { bg: 'bg-red-500', text: 'text-red-600', bgLight: 'bg-red-50', label: 'Rouge' };
            default:
                return { bg: 'bg-gray-300', text: 'text-gray-500', bgLight: 'bg-gray-50', label: '—' };
        }
    };

    const todayStyles = getColorStyles(todayColor);
    const tomorrowStyles = getColorStyles(tomorrowColor);

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* En-tête avec badge Tempo */}
            <div className="px-5 py-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-white to-red-500 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-800">
                                <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-900">Tempo EDF</h2>
                            <p className="text-xs text-slate-500">Contrat heures creuses/pleines</p>
                        </div>
                    </div>
                    {/* Badge heure creuse/pleine */}
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        isPeakHour 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-emerald-100 text-emerald-700'
                    }`}>
                        {isPeakHour ? '⚡ Heure Pleine' : '🌙 Heure Creuse'}
                    </span>
                </div>
            </div>

            <div className="p-5">
                {/* Couleurs du jour */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    {/* Aujourd'hui */}
                    <div className={`rounded-xl p-4 ${todayStyles.bgLight} border border-${todayColor === 'BLANC' ? 'slate-200' : todayStyles.text.replace('text-', '')}/20`}>
                        <p className="text-xs text-slate-500 mb-2">Aujourd'hui</p>
                        <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${todayStyles.bg} ${todayColor === 'BLANC' ? 'border-2 border-slate-300' : ''}`}></div>
                            <span className={`font-bold text-lg ${todayStyles.text}`}>{todayStyles.label}</span>
                        </div>
                    </div>

                    {/* Demain */}
                    <div className={`rounded-xl p-4 ${tomorrowStyles.bgLight} border border-${tomorrowColor === 'BLANC' ? 'slate-200' : tomorrowStyles.text.replace('text-', '')}/20`}>
                        <p className="text-xs text-slate-500 mb-2">Demain</p>
                        <div className="flex items-center gap-2">
                            {tomorrowColor ? (
                                <>
                                    <div className={`w-6 h-6 rounded-full ${tomorrowStyles.bg} ${tomorrowColor === 'BLANC' ? 'border-2 border-slate-300' : ''}`}></div>
                                    <span className={`font-bold text-lg ${tomorrowStyles.text}`}>{tomorrowStyles.label}</span>
                                </>
                            ) : (
                                <span className="text-slate-400 text-sm">En attente...</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Horaires HP/HC */}
                <div className="bg-slate-50 rounded-lg p-3 mb-5">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
                            </svg>
                            <span className="text-slate-600">Heures pleines</span>
                        </div>
                        <span className="font-semibold text-slate-800">{peakHourStart} - {peakHourEnd}</span>
                    </div>
                </div>

                {/* Jours restants */}
                {remainingDays && (
                    <div>
                        <p className="text-xs text-slate-500 mb-3">Jours restants cette saison</p>
                        <div className="grid grid-cols-3 gap-2">
                            {/* Bleu */}
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                                <div className="w-4 h-4 rounded-full bg-blue-500 mx-auto mb-1"></div>
                                <span className="text-lg font-bold text-blue-700">{remainingDays.bleu ?? '—'}</span>
                                <p className="text-[10px] text-blue-500">/ 300</p>
                            </div>
                            {/* Blanc */}
                            <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
                                <div className="w-4 h-4 rounded-full bg-slate-200 border-2 border-slate-300 mx-auto mb-1"></div>
                                <span className="text-lg font-bold text-slate-700">{remainingDays.blanc ?? '—'}</span>
                                <p className="text-[10px] text-slate-500">/ 43</p>
                            </div>
                            {/* Rouge */}
                            <div className="bg-red-50 rounded-lg p-3 text-center">
                                <div className="w-4 h-4 rounded-full bg-red-500 mx-auto mb-1"></div>
                                <span className="text-lg font-bold text-red-700">{remainingDays.rouge ?? '—'}</span>
                                <p className="text-[10px] text-red-500">/ 22</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


/**
 * Composant compact pour afficher les informations Tempo EDF
 */
export default function TempoCard({ tempoData, loading }) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse h-full">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
                <div className="flex gap-2">
                    <div className="h-12 bg-slate-200 rounded flex-1"></div>
                    <div className="h-12 bg-slate-200 rounded flex-1"></div>
                </div>
            </div>
        );
    }

    // Afficher même sans contrat Tempo (mode info)
    const { 
        todayColor, 
        tomorrowColor, 
        isPeakHour, 
        peakHourStart, 
        peakHourEnd,
        remainingDays,
        contractType
    } = tempoData || {};

    // Couleurs Tempo
    const getColorStyles = (color) => {
        switch (color) {
            case 'BLEU':
                return { bg: 'bg-blue-500', text: 'text-blue-600', label: 'Bleu' };
            case 'BLANC':
                return { bg: 'bg-slate-300', text: 'text-slate-600', label: 'Blanc' };
            case 'ROUGE':
                return { bg: 'bg-red-500', text: 'text-red-600', label: 'Rouge' };
            default:
                return { bg: 'bg-gray-300', text: 'text-gray-500', label: '?' };
        }
    };

    const todayStyles = getColorStyles(todayColor);
    const tomorrowStyles = getColorStyles(tomorrowColor);

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 h-full flex flex-col">
            {/* En-tête compact */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 via-white to-red-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-800">
                            <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-slate-900 text-sm">Tempo EDF</span>
                </div>
                {/* Badge heure */}
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                    isPeakHour 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-emerald-100 text-emerald-700'
                }`}>
                    {isPeakHour ? 'HP' : 'HC'}
                </span>
            </div>

            {/* Couleurs du jour - compact */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-500 mb-1">Aujourd'hui</p>
                    <div className="flex items-center justify-center gap-1.5">
                        <div className={`w-4 h-4 rounded-full ${todayStyles.bg}`}></div>
                        <span className={`font-semibold text-sm ${todayStyles.text}`}>{todayStyles.label}</span>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-500 mb-1">Demain</p>
                    <div className="flex items-center justify-center gap-1.5">
                        {tomorrowColor ? (
                            <>
                                <div className={`w-4 h-4 rounded-full ${tomorrowStyles.bg}`}></div>
                                <span className={`font-semibold text-sm ${tomorrowStyles.text}`}>{tomorrowStyles.label}</span>
                            </>
                        ) : (
                            <span className="text-slate-400 text-xs">—</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Horaires HP/HC compact */}
            <div className="text-center text-xs text-slate-500 mb-3">
                HP: {peakHourStart || '06:00'} - {peakHourEnd || '22:00'}
            </div>

            {/* Jours restants - compact */}
            {remainingDays && (remainingDays.bleu !== null || remainingDays.blanc !== null || remainingDays.rouge !== null) && (
                <div className="mt-auto">
                    <p className="text-[10px] text-slate-500 mb-2 text-center">Jours restants</p>
                    <div className="grid grid-cols-3 gap-1.5">
                        <div className="bg-blue-50 rounded p-1.5 text-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mx-auto mb-0.5"></div>
                            <span className="text-xs font-bold text-blue-700">{remainingDays.bleu ?? '—'}</span>
                        </div>
                        <div className="bg-slate-100 rounded p-1.5 text-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 mx-auto mb-0.5"></div>
                            <span className="text-xs font-bold text-slate-700">{remainingDays.blanc ?? '—'}</span>
                        </div>
                        <div className="bg-red-50 rounded p-1.5 text-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 mx-auto mb-0.5"></div>
                            <span className="text-xs font-bold text-red-700">{remainingDays.rouge ?? '—'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

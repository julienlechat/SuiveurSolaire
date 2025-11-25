/**
 * Composant Tempo EDF avec fond pastel selon la couleur du jour
 * Visible de loin sur un écran Raspberry Pi
 */
export default function TempoCard({ tempoData, loading }) {
    // Styles pastel par couleur Tempo
    const getCardTheme = (color) => {
        switch (color) {
            case 'BLEU':
                return {
                    cardBg: 'bg-sky-100',
                    border: 'border-sky-200',
                    textPrimary: 'text-sky-900',
                    textSecondary: 'text-sky-600',
                    accentBg: 'bg-sky-200/60',
                    label: 'Bleu',
                    dotColor: 'bg-sky-500'
                };
            case 'BLANC':
                return {
                    cardBg: 'bg-slate-100',
                    border: 'border-slate-200',
                    textPrimary: 'text-slate-800',
                    textSecondary: 'text-slate-500',
                    accentBg: 'bg-slate-200/60',
                    label: 'Blanc',
                    dotColor: 'bg-slate-400'
                };
            case 'ROUGE':
                return {
                    cardBg: 'bg-rose-100',
                    border: 'border-rose-200',
                    textPrimary: 'text-rose-900',
                    textSecondary: 'text-rose-600',
                    accentBg: 'bg-rose-200/60',
                    label: 'Rouge',
                    dotColor: 'bg-rose-500'
                };
            default:
                return {
                    cardBg: 'bg-slate-50',
                    border: 'border-slate-200',
                    textPrimary: 'text-slate-700',
                    textSecondary: 'text-slate-500',
                    accentBg: 'bg-slate-100',
                    label: '—',
                    dotColor: 'bg-slate-300'
                };
        }
    };

    const getTomorrowStyle = (color) => {
        switch (color) {
            case 'BLEU':
                return { bg: 'bg-sky-500', text: 'text-white', label: 'Bleu' };
            case 'BLANC':
                return { bg: 'bg-slate-400', text: 'text-white', label: 'Blanc' };
            case 'ROUGE':
                return { bg: 'bg-rose-500', text: 'text-white', label: 'Rouge' };
            default:
                return { bg: 'bg-slate-200', text: 'text-slate-500', label: '?' };
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse h-full">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
                <div className="h-20 bg-slate-100 rounded mb-3"></div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 bg-slate-100 rounded"></div>
                    <div className="h-10 bg-slate-100 rounded"></div>
                    <div className="h-10 bg-slate-100 rounded"></div>
                </div>
            </div>
        );
    }

    const { 
        todayColor, 
        tomorrowColor, 
        isPeakHour, 
        peakHourStart, 
        peakHourEnd,
        remainingDays
    } = tempoData || {};

    const theme = getCardTheme(todayColor);
    const tomorrowStyle = getTomorrowStyle(tomorrowColor);

    return (
        <div className={`${theme.cardBg} ${theme.border} border rounded-xl shadow-sm p-4 h-full flex flex-col`}>
            {/* En-tête avec titre et badge HP/HC bien visible */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${theme.dotColor}`}></div>
                    <span className={`font-semibold text-sm ${theme.textPrimary}`}>Tempo EDF</span>
                </div>
                {/* Badge HP/HC TRÈS VISIBLE */}
                <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
                    isPeakHour 
                        ? 'bg-red-500 text-white' 
                        : 'bg-emerald-500 text-white'
                }`}>
                    {isPeakHour ? 'HEURE PLEINE' : 'HEURE CREUSE'}
                </div>
            </div>

            {/* Couleur du jour - BIEN VISIBLE */}
            <div className={`${theme.accentBg} rounded-lg p-3 mb-3`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-[10px] uppercase tracking-wide ${theme.textSecondary} mb-1`}>Aujourd'hui</p>
                        <p className={`text-2xl font-black ${theme.textPrimary}`}>{theme.label}</p>
                    </div>
                    {/* DEMAIN - Plus grand et visible */}
                    <div className="text-right">
                        <p className={`text-[10px] uppercase tracking-wide ${theme.textSecondary} mb-1`}>Demain</p>
                        {tomorrowColor ? (
                            <div className={`${tomorrowStyle.bg} ${tomorrowStyle.text} px-3 py-1.5 rounded-lg font-bold text-sm inline-block`}>
                                {tomorrowStyle.label}
                            </div>
                        ) : (
                            <span className={`text-sm ${theme.textSecondary}`}>En attente</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Horaires HP/HC */}
            <div className={`text-center text-xs ${theme.textSecondary} mb-3`}>
                HP : {peakHourStart || '06:00'} → {peakHourEnd || '22:00'}
            </div>

            {/* Jours restants */}
            {remainingDays && (remainingDays.bleu !== null || remainingDays.blanc !== null || remainingDays.rouge !== null) && (
                <div className="mt-auto">
                    <p className={`text-[10px] ${theme.textSecondary} mb-2 text-center uppercase tracking-wide`}>Jours restants</p>
                    <div className="grid grid-cols-3 gap-1.5">
                        <div className="bg-sky-100 border border-sky-200 rounded-lg p-1.5 text-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 mx-auto mb-0.5"></div>
                            <span className="text-xs font-bold text-sky-800">{remainingDays.bleu ?? '—'}</span>
                        </div>
                        <div className="bg-slate-100 border border-slate-200 rounded-lg p-1.5 text-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mx-auto mb-0.5"></div>
                            <span className="text-xs font-bold text-slate-700">{remainingDays.blanc ?? '—'}</span>
                        </div>
                        <div className="bg-rose-100 border border-rose-200 rounded-lg p-1.5 text-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mx-auto mb-0.5"></div>
                            <span className="text-xs font-bold text-rose-800">{remainingDays.rouge ?? '—'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

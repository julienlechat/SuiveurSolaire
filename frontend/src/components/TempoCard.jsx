/**
 * Composant Tempo EDF élégant avec fond pastel selon la couleur du jour
 * Visible de loin sur un écran Raspberry Pi
 */
export default function TempoCard({ tempoData, loading }) {
    // Styles pastel par couleur Tempo
    const getCardTheme = (color) => {
        switch (color) {
            case 'BLEU':
                return {
                    cardBg: 'bg-gradient-to-br from-sky-50 to-sky-100',
                    border: 'border-sky-200/50',
                    textPrimary: 'text-sky-900',
                    textSecondary: 'text-sky-500',
                    accentBg: 'bg-white/60',
                    label: 'Bleu',
                    dotColor: 'bg-sky-500',
                    shadow: 'shadow-sky-100'
                };
            case 'BLANC':
                return {
                    cardBg: 'bg-gradient-to-br from-slate-50 to-slate-100',
                    border: 'border-slate-200/50',
                    textPrimary: 'text-slate-800',
                    textSecondary: 'text-slate-400',
                    accentBg: 'bg-white/60',
                    label: 'Blanc',
                    dotColor: 'bg-slate-400',
                    shadow: 'shadow-slate-100'
                };
            case 'ROUGE':
                return {
                    cardBg: 'bg-gradient-to-br from-rose-50 to-rose-100',
                    border: 'border-rose-200/50',
                    textPrimary: 'text-rose-900',
                    textSecondary: 'text-rose-400',
                    accentBg: 'bg-white/60',
                    label: 'Rouge',
                    dotColor: 'bg-rose-500',
                    shadow: 'shadow-rose-100'
                };
            default:
                return {
                    cardBg: 'bg-gradient-to-br from-slate-50 to-slate-100',
                    border: 'border-slate-200/50',
                    textPrimary: 'text-slate-700',
                    textSecondary: 'text-slate-400',
                    accentBg: 'bg-white/60',
                    label: '—',
                    dotColor: 'bg-slate-300',
                    shadow: 'shadow-slate-100'
                };
        }
    };

    const getTomorrowStyle = (color) => {
        switch (color) {
            case 'BLEU':
                return { bg: 'bg-sky-500', ring: 'ring-sky-200', text: 'text-white', label: 'Bleu' };
            case 'BLANC':
                return { bg: 'bg-slate-400', ring: 'ring-slate-200', text: 'text-white', label: 'Blanc' };
            case 'ROUGE':
                return { bg: 'bg-rose-500', ring: 'ring-rose-200', text: 'text-white', label: 'Rouge' };
            default:
                return { bg: 'bg-slate-200', ring: '', text: 'text-slate-500', label: '?' };
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm p-3 animate-pulse h-full">
                <div className="h-4 bg-slate-200/50 rounded w-1/2 mb-3"></div>
                <div className="h-16 bg-white/40 rounded-lg mb-2"></div>
                <div className="grid grid-cols-3 gap-1">
                    <div className="h-10 bg-white/40 rounded"></div>
                    <div className="h-10 bg-white/40 rounded"></div>
                    <div className="h-10 bg-white/40 rounded"></div>
                </div>
            </div>
        );
    }

    const { 
        todayColor, 
        tomorrowColor, 
        isPeakHour,
        remainingDays
    } = tempoData || {};

    const theme = getCardTheme(todayColor);
    const tomorrowStyle = getTomorrowStyle(tomorrowColor);

    return (
        <div className={`${theme.cardBg} ${theme.border} border rounded-xl shadow-sm ${theme.shadow} p-3 h-full flex flex-col transition-all duration-300`}>
            {/* En-tête */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${theme.dotColor} ring-2 ring-white`}></div>
                    <span className={`font-medium text-xs ${theme.textSecondary} uppercase tracking-wider`}>Tempo EDF</span>
                </div>
                {/* Badge HP/HC */}
                <div className={`px-2 py-0.5 rounded-full font-semibold text-[10px] tracking-wide ${
                    isPeakHour 
                        ? 'bg-red-500/90 text-white' 
                        : 'bg-emerald-500/90 text-white'
                }`}>
                    {isPeakHour ? 'HEURE PLEINE' : 'HEURE CREUSE'}
                </div>
            </div>

            {/* Zone principale */}
            <div className={`${theme.accentBg} backdrop-blur-sm rounded-lg p-2.5 mb-2 flex-1 flex items-center`}>
                <div className="flex items-center justify-between w-full">
                    {/* Aujourd'hui */}
                    <div>
                        <p className={`text-[9px] uppercase tracking-widest ${theme.textSecondary} mb-0.5 font-medium`}>Aujourd'hui</p>
                        <p className={`text-2xl font-black ${theme.textPrimary} leading-none`}>{theme.label}</p>
                    </div>
                    
                    {/* Séparateur */}
                    <div className={`w-px h-8 ${theme.border} mx-3`}></div>
                    
                    {/* Demain */}
                    <div className="text-right">
                        <p className={`text-[9px] uppercase tracking-widest ${theme.textSecondary} mb-1 font-medium`}>Demain</p>
                        {tomorrowColor ? (
                            <div className={`${tomorrowStyle.bg} ${tomorrowStyle.text} px-2.5 py-0.5 rounded-full font-bold text-xs inline-block ring-2 ${tomorrowStyle.ring}`}>
                                {tomorrowStyle.label}
                            </div>
                        ) : (
                            <span className={`text-xs ${theme.textSecondary} italic`}>En attente</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Jours restants */}
            {remainingDays && (remainingDays.bleu !== null || remainingDays.blanc !== null || remainingDays.rouge !== null) && (
                <div>
                    <p className={`text-[9px] ${theme.textSecondary} mb-1 text-center uppercase tracking-widest font-medium`}>Restants</p>
                    <div className="grid grid-cols-3 gap-1">
                        <div className="bg-white/50 rounded-md py-1 px-1.5 text-center">
                            <span className="text-xs font-bold text-sky-600">{remainingDays.bleu ?? '—'}</span>
                            <span className="text-[9px] text-sky-400 ml-0.5">B</span>
                        </div>
                        <div className="bg-white/50 rounded-md py-1 px-1.5 text-center">
                            <span className="text-xs font-bold text-slate-600">{remainingDays.blanc ?? '—'}</span>
                            <span className="text-[9px] text-slate-400 ml-0.5">W</span>
                        </div>
                        <div className="bg-white/50 rounded-md py-1 px-1.5 text-center">
                            <span className="text-xs font-bold text-rose-600">{remainingDays.rouge ?? '—'}</span>
                            <span className="text-[9px] text-rose-400 ml-0.5">R</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

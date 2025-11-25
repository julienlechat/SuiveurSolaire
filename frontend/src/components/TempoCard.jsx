/**
 * Composant Tempo EDF avec fond coloré selon la couleur du jour
 * Permet de voir de loin la couleur Tempo actuelle
 */
export default function TempoCard({ tempoData, loading }) {
    // Styles par couleur Tempo (fond, texte, accent)
    const getCardTheme = (color) => {
        switch (color) {
            case 'BLEU':
                return {
                    cardBg: 'bg-gradient-to-br from-sky-400 to-blue-500',
                    textPrimary: 'text-white',
                    textSecondary: 'text-blue-100',
                    badgeBg: 'bg-white/20',
                    badgeText: 'text-white',
                    innerCardBg: 'bg-white/15',
                    accentBg: 'bg-white/25',
                    label: 'Bleu',
                    icon: '☀️'
                };
            case 'BLANC':
                return {
                    cardBg: 'bg-gradient-to-br from-slate-200 to-slate-400',
                    textPrimary: 'text-slate-800',
                    textSecondary: 'text-slate-600',
                    badgeBg: 'bg-slate-700/20',
                    badgeText: 'text-slate-800',
                    innerCardBg: 'bg-white/40',
                    accentBg: 'bg-slate-700/15',
                    label: 'Blanc',
                    icon: '⚡'
                };
            case 'ROUGE':
                return {
                    cardBg: 'bg-gradient-to-br from-rose-400 to-red-500',
                    textPrimary: 'text-white',
                    textSecondary: 'text-red-100',
                    badgeBg: 'bg-white/20',
                    badgeText: 'text-white',
                    innerCardBg: 'bg-white/15',
                    accentBg: 'bg-white/25',
                    label: 'Rouge',
                    icon: '🔥'
                };
            default:
                return {
                    cardBg: 'bg-gradient-to-br from-slate-100 to-slate-200',
                    textPrimary: 'text-slate-700',
                    textSecondary: 'text-slate-500',
                    badgeBg: 'bg-slate-300',
                    badgeText: 'text-slate-700',
                    innerCardBg: 'bg-white/50',
                    accentBg: 'bg-slate-300',
                    label: '—',
                    icon: '⚡'
                };
        }
    };

    const getTomorrowBadge = (color) => {
        switch (color) {
            case 'BLEU':
                return { bg: 'bg-blue-500', text: 'text-white', label: 'Bleu' };
            case 'BLANC':
                return { bg: 'bg-slate-400', text: 'text-white', label: 'Blanc' };
            case 'ROUGE':
                return { bg: 'bg-red-500', text: 'text-white', label: 'Rouge' };
            default:
                return { bg: 'bg-slate-300', text: 'text-slate-600', label: '?' };
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-sm p-4 animate-pulse h-full">
                <div className="h-4 bg-white/30 rounded w-1/2 mb-3"></div>
                <div className="h-16 bg-white/20 rounded mb-3"></div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-white/20 rounded"></div>
                    <div className="h-12 bg-white/20 rounded"></div>
                    <div className="h-12 bg-white/20 rounded"></div>
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
    const tomorrowBadge = getTomorrowBadge(tomorrowColor);

    return (
        <div className={`${theme.cardBg} rounded-xl shadow-lg p-4 h-full flex flex-col relative overflow-hidden`}>
            {/* Cercle décoratif en arrière-plan */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10"></div>
            <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/5"></div>
            
            {/* En-tête */}
            <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{theme.icon}</span>
                    <div>
                        <span className={`font-bold text-sm ${theme.textPrimary}`}>Tempo EDF</span>
                        <p className={`text-[10px] ${theme.textSecondary}`}>Jour {theme.label}</p>
                    </div>
                </div>
                {/* Badge HP/HC */}
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    isPeakHour 
                        ? 'bg-white/90 text-red-600' 
                        : 'bg-white/90 text-emerald-600'
                }`}>
                    {isPeakHour ? '⚡ HP' : '🌙 HC'}
                </span>
            </div>

            {/* Zone centrale - Couleur du jour bien visible */}
            <div className={`${theme.innerCardBg} rounded-lg p-3 mb-3 backdrop-blur-sm relative z-10`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-[10px] uppercase tracking-wide ${theme.textSecondary} mb-1`}>Aujourd'hui</p>
                        <p className={`text-2xl font-black ${theme.textPrimary}`}>{theme.label}</p>
                    </div>
                    <div className="text-right">
                        <p className={`text-[10px] uppercase tracking-wide ${theme.textSecondary} mb-1`}>Demain</p>
                        {tomorrowColor ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${tomorrowBadge.bg} ${tomorrowBadge.text}`}>
                                {tomorrowBadge.label}
                            </span>
                        ) : (
                            <span className={`text-sm ${theme.textSecondary}`}>En attente</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Horaires HP/HC */}
            <div className={`text-center text-[11px] ${theme.textSecondary} mb-3 relative z-10`}>
                Heures pleines : {peakHourStart || '06:00'} → {peakHourEnd || '22:00'}
            </div>

            {/* Jours restants */}
            {remainingDays && (remainingDays.bleu !== null || remainingDays.blanc !== null || remainingDays.rouge !== null) && (
                <div className="mt-auto relative z-10">
                    <p className={`text-[10px] ${theme.textSecondary} mb-2 text-center uppercase tracking-wide`}>Jours restants</p>
                    <div className="grid grid-cols-3 gap-1.5">
                        <div className={`${theme.accentBg} backdrop-blur-sm rounded-lg p-2 text-center`}>
                            <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-1 shadow-sm"></div>
                            <span className={`text-sm font-bold ${theme.textPrimary}`}>{remainingDays.bleu ?? '—'}</span>
                        </div>
                        <div className={`${theme.accentBg} backdrop-blur-sm rounded-lg p-2 text-center`}>
                            <div className="w-3 h-3 rounded-full bg-slate-300 mx-auto mb-1 shadow-sm border border-slate-400"></div>
                            <span className={`text-sm font-bold ${theme.textPrimary}`}>{remainingDays.blanc ?? '—'}</span>
                        </div>
                        <div className={`${theme.accentBg} backdrop-blur-sm rounded-lg p-2 text-center`}>
                            <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1 shadow-sm"></div>
                            <span className={`text-sm font-bold ${theme.textPrimary}`}>{remainingDays.rouge ?? '—'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Header de page avec titre, icône et sélecteur de date
export default function Header({ 
    title = "Tableau de bord", 
    subtitle,
    lastUpdate,
    selectedDate,
    onDateChange 
}) {
    // Formater la date de mise à jour
    const formatLastUpdate = (date) => {
        if (!date) return null;
        return new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    // Formater la date pour l'affichage
    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr + "T00:00:00");
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    // Date d'aujourd'hui au format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Partie gauche : icône + titre */}
                <div className="flex items-center gap-4">
                    {/* Icône tableau de bord */}
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                        <svg 
                            className="w-6 h-6 text-amber-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                            />
                        </svg>
                    </div>

                    {/* Titre et sous-titre */}
                    <div>
                        <h1 className="text-xl font-semibold text-slate-800">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-sm text-slate-500 mt-0.5">
                                {subtitle}
                            </p>
                        )}
                        {lastUpdate && (
                            <p className="text-xs text-slate-400 mt-1">
                                Mis à jour à {formatLastUpdate(lastUpdate)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Partie droite : sélecteur de date */}
                <div className="flex items-center gap-3">
                    {/* Affichage de la date formatée */}
                    {selectedDate && (
                        <span className="hidden sm:block text-sm text-slate-500 capitalize">
                            {formatDisplayDate(selectedDate)}
                        </span>
                    )}

                    {/* Input date */}
                    <div className="relative">
                        <input
                            type="date"
                            value={selectedDate || today}
                            max={today}
                            onChange={(e) => onDateChange?.(e.target.value)}
                            className="
                                px-4 py-2 pr-3
                                bg-slate-50 border border-slate-200 
                                rounded-lg text-slate-700 text-sm
                                focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500
                                transition-all cursor-pointer
                                hover:bg-slate-100
                            "
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


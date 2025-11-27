// Header de page - Style original avec fond blanc et bordure
export default function Header({ 
    title = "Tableau de bord", 
    lastUpdate,
    selectedDate,
    onDateChange 
}) {
    // Formater l'heure de mise à jour
    const formatTime = (date) => {
        if (!date) return null;
        return new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Date d'aujourd'hui et d'hier au format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const isToday = selectedDate === today;
    const isYesterday = selectedDate === yesterday;

    return (
        <header className="bg-white border-b border-slate-200 px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Partie gauche : icône + titre */}
                <div className="flex items-center gap-4">
                    {/* Icône éclair orange */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-7 h-7 text-white"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                    </div>

                    {/* Titre et sous-titre */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {title}
                        </h1>
                        {lastUpdate && (
                            <p className="text-sm text-slate-400 mt-1">
                                Mis à jour à {formatTime(lastUpdate)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Partie droite : sélection de date */}
                <div className="flex items-center gap-2">
                    {/* Bouton Aujourd'hui */}
                    <button
                        onClick={() => onDateChange?.(today)}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-lg transition-all
                            ${isToday 
                                ? "bg-slate-900 text-white shadow-md" 
                                : "text-slate-600 hover:bg-slate-100"
                            }
                        `}
                    >
                        Aujourd'hui
                    </button>

                    {/* Bouton Hier */}
                    <button
                        onClick={() => onDateChange?.(yesterday)}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-lg transition-all
                            ${isYesterday 
                                ? "bg-slate-900 text-white shadow-md" 
                                : "text-slate-600 hover:bg-slate-100"
                            }
                        `}
                    >
                        Hier
                    </button>

                    {/* Input date */}
                    <input
                        type="date"
                        value={selectedDate || today}
                        max={today}
                        onChange={(e) => onDateChange?.(e.target.value)}
                        className="
                            px-4 py-2 text-sm border border-slate-200 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                            cursor-pointer
                        "
                    />
                </div>
            </div>
        </header>
    );
}

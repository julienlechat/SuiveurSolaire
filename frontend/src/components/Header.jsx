// Header de page - Style épuré avec icône et description
export default function Header({
    title = "Tableau de bord",
    subtitle,
    lastUpdate,
    selectedDate,
    onDateChange,
}) {
    // Formater l'heure de mise à jour
    const formatTime = (date) => {
        if (!date) return null;
        return new Intl.DateTimeFormat("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    // Date d'aujourd'hui et d'hier au format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

    const isToday = selectedDate === today;
    const isYesterday = selectedDate === yesterday;

    return (
        <header className="bg-white border-b border-slate-200 px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Partie gauche : icône + titre + description */}
                <div className="flex items-center">
                    {/* Icône tableau de bord */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-amber-500 mr-3"
                    >
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {subtitle ||
                                "Suivi énergétique de votre installation"}
                            {lastUpdate && (
                                <>
                                    <span className="mx-1">•</span>
                                    <span>
                                        Mis à jour à {formatTime(lastUpdate)}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Partie droite : sélection de date */}
                <div className="flex items-center gap-2">
                    {/* Bouton Aujourd'hui */}
                    <button
                        onClick={() => onDateChange?.(today)}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-lg transition-all
                            ${
                                isToday
                                    ? "bg-neutral-800 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
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
                            ${
                                isYesterday
                                    ? "bg-neutral-800 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
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
                            px-4 py-2 text-sm border border-gray-200 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                            cursor-pointer
                        "
                    />
                </div>
            </div>
        </header>
    );
}

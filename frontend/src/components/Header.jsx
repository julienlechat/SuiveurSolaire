import { useRef } from "react";

// Header de page - Responsive : simplifié sur mobile, complet sur desktop
export default function Header({
    title = "Tableau de bord",
    subtitle,
    lastUpdate,
    selectedDate,
    onDateChange,
}) {
    const dateInputRef = useRef(null);
    
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

    // Ouvrir le sélecteur de date
    const openDatePicker = () => {
        dateInputRef.current?.showPicker?.();
        dateInputRef.current?.click?.();
    };

    return (
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 py-4 md:py-5">
            {/* Version Mobile */}
            <div className="flex md:hidden items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg
                        className="h-5 w-5 text-amber-500 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                        {lastUpdate && (
                            <p className="text-xs text-gray-500">
                                Mis à jour à {formatTime(lastUpdate)}
                            </p>
                        )}
                    </div>
                </div>
                
                {/* Bouton calendrier mobile */}
                <button
                    onClick={openDatePicker}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>
                
                {/* Input date caché */}
                <input
                    ref={dateInputRef}
                    type="date"
                    value={selectedDate || today}
                    max={today}
                    onChange={(e) => onDateChange?.(e.target.value)}
                    className="sr-only"
                />
            </div>

            {/* Version Desktop */}
            <div className="hidden md:flex items-center justify-between">
                {/* Partie gauche : icône + titre + description */}
                <div className="flex items-center">
                    <svg
                        className="h-5 w-5 text-amber-500 mr-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
                            {subtitle || "Suivi énergétique de votre installation"}
                            {lastUpdate && (
                                <>
                                    <span className="mx-1">•</span>
                                    <span>Mis à jour à {formatTime(lastUpdate)}</span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Partie droite : sélection de date */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDateChange?.(today)}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-lg transition-all
                            ${isToday
                                ? "bg-neutral-800 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                            }
                        `}
                    >
                        Aujourd'hui
                    </button>

                    <button
                        onClick={() => onDateChange?.(yesterday)}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-lg transition-all
                            ${isYesterday
                                ? "bg-neutral-800 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                            }
                        `}
                    >
                        Hier
                    </button>

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

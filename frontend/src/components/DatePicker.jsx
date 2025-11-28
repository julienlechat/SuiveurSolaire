import { useState, useRef, useEffect, useMemo } from "react";

// Date Picker moderne avec calendrier dropdown
export default function DatePicker({ value, onChange, maxDate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        return value ? new Date(value) : new Date();
    });
    const containerRef = useRef(null);

    // Fermer le dropdown quand on clique ailleurs
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Mettre à jour viewDate quand value change
    useEffect(() => {
        if (value) {
            setViewDate(new Date(value));
        }
    }, [value]);

    const max = maxDate ? new Date(maxDate) : new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const calendar = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let startDay = firstDay.getDay() - 1;
        if (startDay < 0) startDay = 6;

        const days = [];
        
        // Jours vides avant le 1er
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }
        
        // Jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return { year, month, days };
    }, [viewDate]);

    const selectedDate = value ? new Date(value) : null;
    const isSelectedMonth = selectedDate && 
        selectedDate.getFullYear() === calendar.year && 
        selectedDate.getMonth() === calendar.month;

    const handleSelectDay = (day) => {
        if (!day) return;
        
        const newDate = new Date(calendar.year, calendar.month, day);
        if (newDate > max) return;
        
        const dateStr = newDate.toISOString().split("T")[0];
        onChange?.(dateStr);
        setIsOpen(false);
    };

    const prevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        if (next <= max) {
            setViewDate(next);
        }
    };

    const goToToday = () => {
        const todayStr = new Date().toISOString().split("T")[0];
        onChange?.(todayStr);
        setViewDate(new Date());
        setIsOpen(false);
    };

    // Formater la date affichée
    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return "Sélectionner";
        const d = new Date(dateStr);
        return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Bouton trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-700">{formatDisplayDate(value)}</span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown calendrier */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-gray-200 shadow-xl p-4 z-50 min-w-[280px]">
                    {/* Header navigation */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={prevMonth}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="font-semibold text-gray-900">
                            {monthNames[calendar.month]} {calendar.year}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            disabled={new Date(calendar.year, calendar.month + 1, 1) > max}
                        >
                            <svg className={`w-4 h-4 ${new Date(calendar.year, calendar.month + 1, 1) > max ? "text-gray-300" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Jours de la semaine */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((d, i) => (
                            <div key={i} className="text-[10px] text-gray-400 text-center font-medium py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Grille des jours */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendar.days.map((day, i) => {
                            if (!day) return <div key={i} />;
                            
                            const dayDate = new Date(calendar.year, calendar.month, day);
                            const isDisabled = dayDate > max;
                            const isSelected = isSelectedMonth && selectedDate?.getDate() === day;
                            const isToday = 
                                today.getFullYear() === calendar.year && 
                                today.getMonth() === calendar.month && 
                                today.getDate() === day;

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelectDay(day)}
                                    disabled={isDisabled}
                                    className={`
                                        w-8 h-8 rounded-lg text-sm font-medium transition-all
                                        ${isDisabled 
                                            ? "text-gray-300 cursor-not-allowed" 
                                            : isSelected
                                                ? "bg-amber-500 text-white"
                                                : isToday
                                                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                    : "text-gray-700 hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button
                            onClick={goToToday}
                            className="flex-1 py-2 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                            Aujourd'hui
                        </button>
                        <button
                            onClick={() => {
                                const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
                                onChange?.(yesterday);
                                setIsOpen(false);
                            }}
                            className="flex-1 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Hier
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


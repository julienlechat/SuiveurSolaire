import { useState, useEffect, useMemo } from "react";

// Carte Tempo EDF avec calendrier mensuel
export default function TempoCard({ tempoData, loading }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [monthColors, setMonthColors] = useState({});
    const [todayColorDirect, setTodayColorDirect] = useState(null);
    const [tomorrowColorDirect, setTomorrowColorDirect] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Charger aujourd'hui et demain directement depuis l'API
    useEffect(() => {
        async function loadTodayTomorrow() {
            try {
                // Aujourd'hui
                const todayRes = await fetch("https://www.api-couleur-tempo.fr/api/jourTempo/today");
                if (todayRes.ok) {
                    const data = await todayRes.json();
                    const couleur = data?.libCouleur || data?.couleur;
                    if (couleur) setTodayColorDirect(couleur.toUpperCase());
                }
            } catch (e) {
                console.error("Error loading today color:", e);
            }
            
            try {
                // Demain
                const tomorrowRes = await fetch("https://www.api-couleur-tempo.fr/api/jourTempo/tomorrow");
                if (tomorrowRes.ok) {
                    const data = await tomorrowRes.json();
                    const couleur = data?.libCouleur || data?.couleur;
                    if (couleur) setTomorrowColorDirect(couleur.toUpperCase());
                }
            } catch (e) {
                // Demain pas encore disponible (avant 11h)
            }
        }
        loadTodayTomorrow();
    }, []);

    // Charger les couleurs du mois
    useEffect(() => {
        async function loadMonthColors() {
            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth();
                const colors = {};

                // Charger les jours du mois (du 1er jusqu'à aujourd'hui + demain si dispo)
                const lastDay = new Date(year, month + 1, 0).getDate();
                
                for (let day = 1; day <= Math.min(today.getDate() + 1, lastDay); day++) {
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    try {
                        const res = await fetch(`https://www.api-couleur-tempo.fr/api/jourTempo/${dateStr}`);
                        if (res.ok) {
                            const data = await res.json();
                            const couleur = data?.libCouleur || data?.couleur;
                            if (couleur) {
                                colors[day] = couleur.toUpperCase();
                            }
                        }
                    } catch (e) {
                        // Ignorer les erreurs pour les jours individuels
                    }
                }
                
                setMonthColors(colors);
            } catch (e) {
                console.error("Error loading month colors:", e);
            }
        }

        loadMonthColors();
    }, []);

    // Générer le calendrier du mois
    const calendar = useMemo(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Jour de la semaine du 1er (0 = dimanche, on veut lundi = 0)
        let startDay = firstDay.getDay() - 1;
        if (startDay < 0) startDay = 6;

        const weeks = [];
        let currentWeek = new Array(startDay).fill(null);

        for (let day = 1; day <= daysInMonth; day++) {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }
        
        // Compléter la dernière semaine
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }

        return { weeks, today: today.getDate(), month, year };
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse h-full">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
            </div>
        );
    }

    if (!tempoData) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-4 h-full">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-50">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">Tempo EDF</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Non configuré</p>
            </div>
        );
    }

    const colorConfig = {
        BLEU: { bg: "bg-sky-500", light: "bg-sky-100", text: "text-sky-700", label: "Bleu" },
        BLANC: { bg: "bg-white border-2 border-gray-300", light: "bg-gray-50", text: "text-gray-700", label: "Blanc" },
        ROUGE: { bg: "bg-red-500", light: "bg-red-100", text: "text-red-700", label: "Rouge" },
    };

    // Utiliser les couleurs directes de l'API, sinon fallback sur tempoData du backend
    const todayColor = todayColorDirect || tempoData?.todayColor;
    const tomorrowColor = tomorrowColorDirect || tempoData?.tomorrowColor;
    
    const today = todayColor ? colorConfig[todayColor] : null;
    const tomorrow = tomorrowColor ? colorConfig[tomorrowColor] : null;

    // Position actuelle et type de période
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const position = ((currentHour * 60 + currentMinute) / (24 * 60)) * 100;
    
    // HP: 6h-22h, HC: reste
    const hpStart = 6, hpEnd = 22;
    const isInHP = currentHour >= hpStart && currentHour < hpEnd;

    // Nom du mois
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 h-full flex flex-col">
            {/* Header avec icône style KPI */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-50">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">Tempo EDF</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400">
                        {currentTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className={`
                        text-[9px] px-1.5 py-0.5 rounded font-bold
                        ${tempoData.isHeuresCreuses ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}
                    `}>
                        {tempoData.isHeuresCreuses ? "HC" : "HP"}
                    </span>
                </div>
            </div>

            {/* Couleurs jour */}
            <div className="flex gap-2 mb-3">
                <div className={`flex-1 rounded-lg p-2 ${today?.light || "bg-gray-50"}`}>
                    <p className="text-[9px] text-gray-500 uppercase font-medium">Aujourd'hui</p>
                    {today ? (
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${today.bg}`}></span>
                            <span className={`font-bold text-sm ${today.text}`}>{today.label}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-300 mt-0.5 block">Chargement...</span>
                    )}
                </div>
                <div className={`flex-1 rounded-lg p-2 ${tomorrow?.light || "bg-gray-50"}`}>
                    <p className="text-[9px] text-gray-500 uppercase font-medium">Demain</p>
                    {tomorrow ? (
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${tomorrow.bg}`}></span>
                            <span className={`font-bold text-sm ${tomorrow.text}`}>{tomorrow.label}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-300 mt-0.5 block">—</span>
                    )}
                </div>
            </div>

            {/* Timeline HP/HC avec couleurs claires */}
            <div className="mb-3">
                <div className="relative h-4 rounded-full overflow-hidden flex">
                    {/* HC matin (0h-6h) */}
                    <div className="bg-emerald-100" style={{ width: `${(hpStart/24)*100}%` }} />
                    {/* HP (6h-22h) */}
                    <div className="bg-amber-100" style={{ width: `${((hpEnd-hpStart)/24)*100}%` }} />
                    {/* HC soir (22h-24h) */}
                    <div className="bg-emerald-100" style={{ width: `${((24-hpEnd)/24)*100}%` }} />
                    
                    {/* Curseur dynamique */}
                    <div 
                        className={`absolute top-0 bottom-0 w-1 rounded-full ${isInHP ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ left: `calc(${position}% - 2px)` }}
                    />
                </div>
                {/* Labels */}
                <div className="flex justify-between mt-0.5 text-[8px] text-gray-400">
                    <span>0h</span>
                    <span>6h</span>
                    <span>12h</span>
                    <span>18h</span>
                    <span>24h</span>
                </div>
            </div>

            {/* Calendrier du mois */}
            <div className="flex-1">
                <p className="text-[9px] text-gray-500 uppercase font-medium mb-1.5">
                    {monthNames[calendar.month]} {calendar.year}
                </p>
                
                {/* Jours de la semaine */}
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                        <div key={i} className="text-[8px] text-gray-400 text-center font-medium">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Grille des jours - responsive */}
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                    {calendar.weeks.flat().map((day, i) => {
                        if (!day) return <div key={i} />;

                        const color = monthColors[day];
                        const isToday = day === calendar.today;
                        const isPast = day < calendar.today;
                        const isTomorrow = day === calendar.today + 1;

                        let bgClass = "";
                        let textClass = "text-gray-400";

                        if (color) {
                            if (color.includes("BLEU")) {
                                bgClass = "bg-sky-500";
                                textClass = "text-white";
                            } else if (color.includes("BLANC")) {
                                bgClass = "bg-white border border-gray-300";
                                textClass = "text-gray-700";
                            } else if (color.includes("ROUGE")) {
                                bgClass = "bg-red-500";
                                textClass = "text-white";
                            }
                        } else if (isPast) {
                            // Jours passés sans couleur connue
                            bgClass = "bg-gray-100";
                            textClass = "text-gray-500";
                        } else {
                            // Jours futurs sans info
                            textClass = "text-gray-300";
                        }

                        return (
                            <div
                                key={i}
                                className={`
                                    aspect-square max-w-6 rounded-full flex items-center justify-center
                                    text-[7px] sm:text-[8px] font-medium
                                    ${bgClass} ${textClass}
                                    ${isToday ? "ring-1 ring-gray-600 ring-offset-1" : ""}
                                `}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Jours consommés / total */}
            {tempoData?.stats && (
                <div className="flex gap-1.5 mt-2 pt-2 border-t border-gray-100">
                    <div className="flex-1 flex flex-col items-center py-1.5 bg-sky-50 rounded">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500 mb-0.5"></span>
                        <span className="text-[10px] font-bold text-sky-700">
                            {tempoData.stats.joursBleuConsommes || 0}/{(tempoData.stats.joursBleuConsommes || 0) + (tempoData.stats.joursBleuRestants || 0)}
                        </span>
                    </div>
                    <div className="flex-1 flex flex-col items-center py-1.5 bg-gray-50 rounded border border-gray-200">
                        <span className="w-2.5 h-2.5 rounded-full bg-white border border-gray-400 mb-0.5"></span>
                        <span className="text-[10px] font-bold text-gray-700">
                            {tempoData.stats.joursBlancConsommes || 0}/{(tempoData.stats.joursBlancConsommes || 0) + (tempoData.stats.joursBlancRestants || 0)}
                        </span>
                    </div>
                    <div className="flex-1 flex flex-col items-center py-1.5 bg-red-50 rounded">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 mb-0.5"></span>
                        <span className="text-[10px] font-bold text-red-700">
                            {tempoData.stats.joursRougeConsommes || 0}/{(tempoData.stats.joursRougeConsommes || 0) + (tempoData.stats.joursRougeRestants || 0)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

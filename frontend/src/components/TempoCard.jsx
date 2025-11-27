import { useState, useEffect } from "react";

// Carte Tempo EDF avec mini graphique HP/HC
export default function TempoCard({ tempoData, loading }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Mise à jour temps réel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Toutes les minutes
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse h-full">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-slate-200 rounded"></div>
            </div>
        );
    }

    if (!tempoData) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5 h-full">
                <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-semibold text-gray-900">Tempo EDF</span>
                </div>
                <p className="text-sm text-gray-500">
                    Aucun contrat Tempo configuré
                </p>
            </div>
        );
    }

    const colorStyles = {
        BLEU: { bg: "bg-sky-100", text: "text-sky-700", dot: "bg-sky-500", label: "Bleu", barBg: "bg-sky-200" },
        BLANC: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400", label: "Blanc", barBg: "bg-slate-200" },
        ROUGE: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Rouge", barBg: "bg-red-200" },
    };

    const todayStyle = colorStyles[tempoData.todayColor] || colorStyles.BLEU;
    const tomorrowStyle = colorStyles[tempoData.tomorrowColor];

    // Calcul de la position actuelle (en %)
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentPosition = ((currentHour * 60 + currentMinute) / (24 * 60)) * 100;

    // HP: 06:00-22:00, HC: 22:00-06:00 (par défaut)
    const hpStart = 6;  // 6h
    const hpEnd = 22;   // 22h

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-semibold text-gray-900">Tempo EDF</span>
                </div>
                {tempoData.isHeuresCreuses !== null && (
                    <span className={`
                        text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide
                        ${tempoData.isHeuresCreuses 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-amber-100 text-amber-700"
                        }
                    `}>
                        {tempoData.isHeuresCreuses ? "HC" : "HP"}
                    </span>
                )}
            </div>

            {/* Couleur du jour + demain */}
            <div className="flex gap-2 mb-4">
                <div className={`flex-1 px-3 py-2 rounded-lg ${todayStyle.bg}`}>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Aujourd'hui</p>
                    <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${todayStyle.dot}`}></span>
                        <span className={`font-bold text-sm ${todayStyle.text}`}>
                            {todayStyle.label}
                        </span>
                    </div>
                </div>

                <div className={`flex-1 px-3 py-2 rounded-lg ${tomorrowStyle?.bg || "bg-gray-50"}`}>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Demain</p>
                    {tomorrowStyle ? (
                        <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${tomorrowStyle.dot}`}></span>
                            <span className={`font-bold text-sm ${tomorrowStyle.text}`}>
                                {tomorrowStyle.label}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">—</span>
                    )}
                </div>
            </div>

            {/* Mini graphique HP/HC 24h */}
            <div className="mb-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Plage horaire</p>
                <div className="relative h-6 bg-gray-100 rounded-md overflow-hidden">
                    {/* Zones HC (avant 6h et après 22h) */}
                    <div 
                        className="absolute top-0 bottom-0 bg-emerald-200"
                        style={{ left: "0%", width: `${(hpStart / 24) * 100}%` }}
                    />
                    <div 
                        className="absolute top-0 bottom-0 bg-emerald-200"
                        style={{ left: `${(hpEnd / 24) * 100}%`, right: "0%" }}
                    />
                    
                    {/* Zone HP (6h-22h) */}
                    <div 
                        className="absolute top-0 bottom-0 bg-amber-200"
                        style={{ 
                            left: `${(hpStart / 24) * 100}%`, 
                            width: `${((hpEnd - hpStart) / 24) * 100}%` 
                        }}
                    />

                    {/* Curseur position actuelle */}
                    <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                        style={{ left: `${currentPosition}%` }}
                    >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
                    </div>

                    {/* Labels heures */}
                    <div className="absolute inset-0 flex justify-between items-center px-1 text-[8px] font-medium text-gray-500">
                        <span>0h</span>
                        <span>6h</span>
                        <span>12h</span>
                        <span>18h</span>
                        <span>24h</span>
                    </div>
                </div>
                <div className="flex justify-center gap-4 mt-1.5 text-[9px] text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm bg-emerald-200"></span> HC
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm bg-amber-200"></span> HP
                    </span>
                </div>
            </div>

            {/* Heure actuelle */}
            <div className="text-center mb-4 py-2 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Heure actuelle</p>
                <p className="text-lg font-bold text-gray-900">
                    {currentTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
            </div>

            {/* Tarif actuel */}
            {tempoData.tarifActuel && (
                <div className="text-center mb-4 py-2 bg-slate-50 rounded-lg">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Tarif actuel</p>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-lg font-bold text-gray-900">
                            {(tempoData.tarifActuel * 100).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">c€/kWh</span>
                    </div>
                </div>
            )}

            {/* Jours restants */}
            {tempoData.stats && (
                <div className="mt-auto">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Jours restants</p>
                    <div className="grid grid-cols-3 gap-1.5">
                        <div className="text-center p-1.5 bg-sky-50 rounded-lg">
                            <span className="block text-sm font-bold text-sky-700">
                                {tempoData.stats.joursBleuRestants}
                            </span>
                            <span className="text-[9px] text-sky-600">Bleu</span>
                        </div>
                        <div className="text-center p-1.5 bg-slate-100 rounded-lg">
                            <span className="block text-sm font-bold text-slate-700">
                                {tempoData.stats.joursBlancRestants}
                            </span>
                            <span className="text-[9px] text-slate-600">Blanc</span>
                        </div>
                        <div className="text-center p-1.5 bg-red-50 rounded-lg">
                            <span className="block text-sm font-bold text-red-700">
                                {tempoData.stats.joursRougeRestants}
                            </span>
                            <span className="text-[9px] text-red-600">Rouge</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

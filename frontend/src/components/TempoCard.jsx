import { useState, useEffect } from "react";

// Carte Tempo EDF compacte et élégante
export default function TempoCard({ tempoData, loading }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse h-full">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            </div>
        );
    }

    if (!tempoData) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-4 h-full">
                <div className="flex items-center gap-2">
                    <span className="text-amber-500 text-lg">⚡</span>
                    <span className="font-semibold text-gray-900 text-sm">Tempo EDF</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Non configuré</p>
            </div>
        );
    }

    const colorConfig = {
        BLEU: { bg: "bg-sky-500", light: "bg-sky-100", text: "text-sky-700", label: "Bleu" },
        BLANC: { bg: "bg-slate-400", light: "bg-slate-100", text: "text-slate-700", label: "Blanc" },
        ROUGE: { bg: "bg-red-500", light: "bg-red-100", text: "text-red-700", label: "Rouge" },
    };

    const today = colorConfig[tempoData.todayColor] || colorConfig.BLEU;
    const tomorrow = colorConfig[tempoData.tomorrowColor];

    // Position actuelle (%)
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const position = ((currentHour * 60 + currentMinute) / (24 * 60)) * 100;

    // HP: 6h-22h
    const hpStart = 6, hpEnd = 22;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 h-full flex flex-col">
            {/* Header compact */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                    <span className="text-amber-500 text-base">⚡</span>
                    <span className="font-semibold text-gray-900 text-sm">Tempo</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400">
                        {currentTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className={`
                        text-[9px] px-1.5 py-0.5 rounded font-bold
                        ${tempoData.isHeuresCreuses ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}
                    `}>
                        {tempoData.isHeuresCreuses ? "HC" : "HP"}
                    </span>
                </div>
            </div>

            {/* Couleurs jour */}
            <div className="flex gap-2 mb-3">
                <div className={`flex-1 rounded-lg p-2 ${today.light}`}>
                    <p className="text-[9px] text-gray-500 uppercase font-medium">Aujourd'hui</p>
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${today.bg}`}></span>
                        <span className={`font-bold text-sm ${today.text}`}>{today.label}</span>
                    </div>
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

            {/* Timeline HP/HC élégante */}
            <div className="mb-3">
                <div className="relative h-5 rounded-full overflow-hidden bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400"
                    style={{
                        background: `linear-gradient(to right, 
                            #34d399 0%, 
                            #34d399 ${(hpStart/24)*100}%, 
                            #fbbf24 ${(hpStart/24)*100}%, 
                            #fbbf24 ${(hpEnd/24)*100}%, 
                            #34d399 ${(hpEnd/24)*100}%, 
                            #34d399 100%)`
                    }}
                >
                    {/* Curseur position actuelle */}
                    <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-10"
                        style={{ left: `${position}%`, boxShadow: "0 0 4px rgba(0,0,0,0.3)" }}
                    >
                        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow" />
                        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow" />
                    </div>
                </div>
                {/* Labels heures */}
                <div className="flex justify-between mt-1 text-[8px] text-gray-400 px-0.5">
                    <span>0h</span>
                    <span>6h</span>
                    <span>12h</span>
                    <span>18h</span>
                    <span>24h</span>
                </div>
            </div>

            {/* Tarif actuel */}
            {tempoData.tarifActuel && (
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg mb-3">
                    <span className="text-[10px] text-gray-500 uppercase font-medium">Tarif</span>
                    <span className="font-bold text-gray-900">
                        {(tempoData.tarifActuel * 100).toFixed(2)} <span className="text-xs font-normal text-gray-500">c€/kWh</span>
                    </span>
                </div>
            )}

            {/* Jours restants */}
            {tempoData.stats && (
                <div className="mt-auto">
                    <div className="flex gap-1">
                        <div className="flex-1 text-center py-1.5 bg-sky-50 rounded-lg">
                            <span className="block text-sm font-bold text-sky-600">{tempoData.stats.joursBleuRestants}</span>
                            <span className="text-[8px] text-sky-500 uppercase">Bleu</span>
                        </div>
                        <div className="flex-1 text-center py-1.5 bg-slate-100 rounded-lg">
                            <span className="block text-sm font-bold text-slate-600">{tempoData.stats.joursBlancRestants}</span>
                            <span className="text-[8px] text-slate-500 uppercase">Blanc</span>
                        </div>
                        <div className="flex-1 text-center py-1.5 bg-red-50 rounded-lg">
                            <span className="block text-sm font-bold text-red-600">{tempoData.stats.joursRougeRestants}</span>
                            <span className="text-[8px] text-red-500 uppercase">Rouge</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

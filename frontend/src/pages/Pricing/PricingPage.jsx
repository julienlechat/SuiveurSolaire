import { useEffect, useState, useMemo } from "react";
import { fetchHistoryGraph } from "../../api";

// SVG € simple
const EuroIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="20" fontWeight="bold">€</text>
    </svg>
);

// Header
function PricingHeader() {
    return (
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 py-4 md:py-5">
            <div className="flex items-center">
                <div className="p-2 rounded-lg bg-emerald-100 mr-3">
                    <EuroIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Suivi des coûts</h2>
                    <p className="text-sm text-gray-500">Analyse et comparaison de votre consommation</p>
                </div>
            </div>
        </header>
    );
}

// Section card
function Section({ icon, title, description, children, headerRight, className = "" }) {
    return (
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">{icon}</div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                    {description && <p className="text-xs text-gray-500 truncate">{description}</p>}
                </div>
                {headerRight}
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

// Tooltip component
function Tooltip({ children, content, className = "" }) {
    const [show, setShow] = useState(false);
    return (
        <div className={`relative ${className}`} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            {children}
            {show && content && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    );
}

// Données contrat Tempo
const CONTRACT = {
    name: "Tempo",
    provider: "EDF",
    startDate: "2024-09-01",
    subscription: 15.79,
    hcPeriods: ["22h00 - 06h00"],
    tarifs: {
        bleu: { hc: 0.1296, hp: 0.1609 },
        blanc: { hc: 0.1486, hp: 0.1894 },
        rouge: { hc: 0.1568, hp: 0.7562 },
    },
};

export default function PricingPage() {
    const [loading, setLoading] = useState(true);
    const [seasonStats, setSeasonStats] = useState(null);
    const [weekData, setWeekData] = useState({ current: [], previous: [] });
    const [viewMode, setViewMode] = useState("kwh"); // "kwh" ou "euro"

    useEffect(() => {
        async function loadData() {
            try {
                const today = new Date();
                const dayOfWeek = today.getDay() || 7;
                const currentWeek = [];
                const previousWeek = [];
                const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

                for (let i = 1; i <= 7; i++) {
                    // Semaine actuelle
                    const currentDate = new Date(today);
                    currentDate.setDate(today.getDate() - dayOfWeek + i);
                    
                    if (currentDate <= today) {
                        const dateStr = currentDate.toISOString().split("T")[0];
                        try {
                            const data = await fetchHistoryGraph(dateStr);
                            if (data.ok && data.stats) {
                                const kwh = Number(data.stats.totalConsumption) || 0;
                                const kwhHp = kwh * 0.6;
                                const kwhHc = kwh * 0.4;
                                const costHp = kwhHp * CONTRACT.tarifs.bleu.hp;
                                const costHc = kwhHc * CONTRACT.tarifs.bleu.hc;
                                currentWeek.push({
                                    day: dayNames[i - 1],
                                    date: dateStr,
                                    kwh, kwhHp, kwhHc,
                                    cost: costHp + costHc, costHp, costHc
                                });
                            } else {
                                currentWeek.push({ day: dayNames[i - 1], date: dateStr, kwh: 0, kwhHp: 0, kwhHc: 0, cost: 0, costHp: 0, costHc: 0 });
                            }
                        } catch {
                            currentWeek.push({ day: dayNames[i - 1], date: dateStr, kwh: 0, kwhHp: 0, kwhHc: 0, cost: 0, costHp: 0, costHc: 0 });
                        }
                    }

                    // Semaine précédente
                    const prevDate = new Date(today);
                    prevDate.setDate(today.getDate() - dayOfWeek + i - 7);
                    const prevDateStr = prevDate.toISOString().split("T")[0];
                    try {
                        const data = await fetchHistoryGraph(prevDateStr);
                        if (data.ok && data.stats) {
                            const kwh = Number(data.stats.totalConsumption) || 0;
                            const kwhHp = kwh * 0.6;
                            const kwhHc = kwh * 0.4;
                            const costHp = kwhHp * CONTRACT.tarifs.bleu.hp;
                            const costHc = kwhHc * CONTRACT.tarifs.bleu.hc;
                            previousWeek.push({
                                day: dayNames[i - 1],
                                date: prevDateStr,
                                kwh, kwhHp, kwhHc,
                                cost: costHp + costHc, costHp, costHc
                            });
                        } else {
                            previousWeek.push({ day: dayNames[i - 1], date: prevDateStr, kwh: 0, kwhHp: 0, kwhHc: 0, cost: 0, costHp: 0, costHc: 0 });
                        }
                    } catch {
                        previousWeek.push({ day: dayNames[i - 1], date: prevDateStr, kwh: 0, kwhHp: 0, kwhHc: 0, cost: 0, costHp: 0, costHc: 0 });
                    }
                }

                setWeekData({ current: currentWeek, previous: previousWeek });

                // Stats saison Tempo
                const currentYear = today.getFullYear();
                const currentMonth = today.getMonth();
                let startSeasonYear = currentYear;
                if (currentMonth < 8) startSeasonYear--;

                const res = await fetch("https://www.api-couleur-tempo.fr/api/joursTempo");
                if (res.ok) {
                    const allDays = await res.json();
                    const startDate = new Date(startSeasonYear, 8, 1);
                    const endDate = new Date(startSeasonYear + 1, 7, 31);

                    let bleu = 0, blanc = 0, rouge = 0;
                    allDays.forEach(day => {
                        const dayDate = new Date(day.dateJour);
                        if (dayDate >= startDate && dayDate <= endDate && dayDate <= today) {
                            const color = (day.libCouleur || day.couleur)?.toUpperCase();
                            if (color === "BLEU") bleu++;
                            if (color === "BLANC") blanc++;
                            if (color === "ROUGE") rouge++;
                        }
                    });

                    setSeasonStats({ periode: `${startSeasonYear}-${startSeasonYear + 1}`, bleu, blanc, rouge });
                }
            } catch (e) {
                console.error("Error loading data:", e);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Calculs
    const comparison = useMemo(() => {
        const sum = (arr) => arr.reduce((acc, d) => ({ 
            kwh: acc.kwh + d.kwh, kwhHp: acc.kwhHp + d.kwhHp, kwhHc: acc.kwhHc + d.kwhHc,
            cost: acc.cost + d.cost, costHp: acc.costHp + d.costHp, costHc: acc.costHc + d.costHc,
        }), { kwh: 0, kwhHp: 0, kwhHc: 0, cost: 0, costHp: 0, costHc: 0 });
        
        const current = sum(weekData.current);
        const previous = sum(weekData.previous);
        const diff = previous.kwh > 0 ? ((current.kwh - previous.kwh) / previous.kwh * 100) : 0;
        const costDiff = previous.cost > 0 ? ((current.cost - previous.cost) / previous.cost * 100) : 0;

        return { current, previous, diff, costDiff };
    }, [weekData]);

    // Min/max tarifs
    const allPrices = Object.values(CONTRACT.tarifs).flatMap(t => [t.hc, t.hp]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const getPriceColor = (price) => {
        if (price === minPrice) return "text-emerald-600 font-semibold";
        if (price === maxPrice) return "text-rose-600 font-semibold";
        return "text-gray-900";
    };

    // Couleurs selon mode
    const colors = viewMode === "kwh" 
        ? { hp: "bg-blue-600", hc: "bg-blue-300", hpPrev: "bg-slate-500", hcPrev: "bg-slate-300" }
        : { hp: "bg-emerald-600", hc: "bg-emerald-300", hpPrev: "bg-slate-500", hcPrev: "bg-slate-300" };

    const maxValue = Math.max(
        ...weekData.current.map(d => viewMode === "kwh" ? d.kwh : d.cost),
        ...weekData.previous.map(d => viewMode === "kwh" ? d.kwh : d.cost),
        1
    );

    if (loading) {
        return (
            <>
                <PricingHeader />
                <div className="p-4 md:p-6">
                    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 bg-white rounded-xl border h-96" />
                        <div className="bg-white rounded-xl border h-96" />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PricingHeader />
            
            <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* ===== GRAPHIQUE UNIFIÉ (66%) ===== */}
                    <div className="lg:col-span-2">
                        <Section
                            icon={viewMode === "kwh" 
                                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                : <EuroIcon className="w-4 h-4" />
                            }
                            title="Comparaison hebdomadaire"
                            description="Semaine en cours vs semaine précédente"
                            headerRight={
                                <div className="flex bg-slate-100 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setViewMode("kwh")}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                                            viewMode === "kwh" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        kWh
                                    </button>
                                    <button
                                        onClick={() => setViewMode("euro")}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                                            viewMode === "euro" ? "bg-white shadow text-emerald-600" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        €
                                    </button>
                                </div>
                            }
                        >
                            {/* Résumé */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className={`p-4 rounded-xl ${viewMode === "kwh" ? "bg-blue-50" : "bg-emerald-50"}`}>
                                    <p className={`text-xs font-medium ${viewMode === "kwh" ? "text-blue-600" : "text-emerald-600"}`}>Cette semaine</p>
                                    <p className={`text-2xl font-bold ${viewMode === "kwh" ? "text-blue-700" : "text-emerald-700"}`}>
                                        {viewMode === "kwh" 
                                            ? `${comparison.current.kwh.toFixed(1)} kWh`
                                            : `${comparison.current.cost.toFixed(2)} €`
                                        }
                                    </p>
                                    <div className={`flex gap-3 mt-1 text-xs ${viewMode === "kwh" ? "text-blue-600" : "text-emerald-600"}`}>
                                        <span>HP: {viewMode === "kwh" ? `${comparison.current.kwhHp.toFixed(1)}` : `${comparison.current.costHp.toFixed(2)}€`}</span>
                                        <span>HC: {viewMode === "kwh" ? `${comparison.current.kwhHc.toFixed(1)}` : `${comparison.current.costHc.toFixed(2)}€`}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-xs text-gray-500 font-medium">Semaine précédente</p>
                                    <p className="text-2xl font-bold text-gray-700">
                                        {viewMode === "kwh" 
                                            ? `${comparison.previous.kwh.toFixed(1)} kWh`
                                            : `${comparison.previous.cost.toFixed(2)} €`
                                        }
                                    </p>
                                    <div className={`mt-1 text-xs font-medium ${
                                        (viewMode === "kwh" ? comparison.diff : comparison.costDiff) > 0 ? "text-rose-600" : "text-emerald-600"
                                    }`}>
                                        {(viewMode === "kwh" ? comparison.diff : comparison.costDiff) > 0 ? "+" : ""}
                                        {(viewMode === "kwh" ? comparison.diff : comparison.costDiff).toFixed(0)}%
                                    </div>
                                </div>
                            </div>
                            
                            {/* Barres avec HP/HC séparées */}
                            <div className="space-y-3">
                                {weekData.current.map((d, i) => {
                                    const prev = weekData.previous[i] || { kwh: 0, kwhHp: 0, kwhHc: 0, cost: 0, costHp: 0, costHc: 0 };
                                    const currentValue = viewMode === "kwh" ? d.kwh : d.cost;
                                    const currentHp = viewMode === "kwh" ? d.kwhHp : d.costHp;
                                    const currentHc = viewMode === "kwh" ? d.kwhHc : d.costHc;
                                    const prevValue = viewMode === "kwh" ? prev.kwh : prev.cost;
                                    const prevHp = viewMode === "kwh" ? prev.kwhHp : prev.costHp;
                                    const prevHc = viewMode === "kwh" ? prev.kwhHc : prev.costHc;
                                    
                                    const unit = viewMode === "kwh" ? "kWh" : "€";
                                    
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-8 text-xs text-gray-500 font-medium">{d.day}</span>
                                            <div className="flex-1 flex gap-2">
                                                {/* Barre actuelle */}
                                                <Tooltip className="flex-1" content={
                                                    <div className="text-center">
                                                        <div className="font-semibold">{d.day} (cette semaine)</div>
                                                        <div>Total: {currentValue.toFixed(viewMode === "kwh" ? 1 : 2)} {unit}</div>
                                                        <div className="flex gap-2 justify-center mt-1">
                                                            <span>HP: {currentHp.toFixed(viewMode === "kwh" ? 1 : 2)}</span>
                                                            <span>HC: {currentHc.toFixed(viewMode === "kwh" ? 1 : 2)}</span>
                                                        </div>
                                                    </div>
                                                }>
                                                    <div className="h-6 bg-slate-100 rounded-md cursor-pointer hover:opacity-80 transition-opacity flex">
                                                        <div className={`h-full ${colors.hp} rounded-l-md`} style={{ width: `${Math.max((currentHp / maxValue) * 100, 0)}%` }} />
                                                        <div className={`h-full ${colors.hc} rounded-r-md`} style={{ width: `${Math.max((currentHc / maxValue) * 100, 0)}%` }} />
                                                    </div>
                                                </Tooltip>
                                                
                                                {/* Barre précédente */}
                                                <Tooltip className="flex-1" content={
                                                    <div className="text-center">
                                                        <div className="font-semibold">{prev.day} (semaine précédente)</div>
                                                        <div>Total: {prevValue.toFixed(viewMode === "kwh" ? 1 : 2)} {unit}</div>
                                                        <div className="flex gap-2 justify-center mt-1">
                                                            <span>HP: {prevHp.toFixed(viewMode === "kwh" ? 1 : 2)}</span>
                                                            <span>HC: {prevHc.toFixed(viewMode === "kwh" ? 1 : 2)}</span>
                                                        </div>
                                                    </div>
                                                }>
                                                    <div className="h-6 bg-slate-100 rounded-md cursor-pointer hover:opacity-80 transition-opacity flex">
                                                        <div className={`h-full ${colors.hpPrev} rounded-l-md`} style={{ width: `${Math.max((prevHp / maxValue) * 100, 0)}%` }} />
                                                        <div className={`h-full ${colors.hcPrev} rounded-r-md`} style={{ width: `${Math.max((prevHc / maxValue) * 100, 0)}%` }} />
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <span className="w-28 text-xs text-right">
                                                <span className={viewMode === "kwh" ? "text-blue-600" : "text-emerald-600"}>
                                                    {currentValue.toFixed(viewMode === "kwh" ? 1 : 2)}
                                                </span>
                                                <span className="text-gray-400 mx-1">/</span>
                                                <span className="text-gray-500">{prevValue.toFixed(viewMode === "kwh" ? 1 : 2)}</span>
                                                <span className="text-gray-400 ml-0.5">{unit}</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Légende */}
                            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                    <span className="font-medium">Cette semaine:</span>
                                    <span className="flex items-center gap-1">
                                        <span className={`w-3 h-3 rounded ${colors.hp}`} /> HP
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className={`w-3 h-3 rounded ${colors.hc}`} /> HC
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-medium">Sem. précédente:</span>
                                    <span className="flex items-center gap-1">
                                        <span className={`w-3 h-3 rounded ${colors.hpPrev}`} /> HP
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className={`w-3 h-3 rounded ${colors.hcPrev}`} /> HC
                                    </span>
                                </div>
                            </div>
                        </Section>
                    </div>

                    {/* ===== CARD CONTRAT (33%) ===== */}
                    <div className="lg:col-span-1">
                        <Section
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                            title="Contrat"
                            className="h-full"
                        >
                            {/* Nom et date */}
                            <div className="mb-4 pb-4 border-b border-slate-100">
                                <p className="text-lg font-bold text-gray-900">{CONTRACT.name} {CONTRACT.provider}</p>
                                <p className="text-xs text-gray-500">Depuis le {new Date(CONTRACT.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                            </div>

                            {/* Heures creuses */}
                            <div className="mb-4 pb-4 border-b border-slate-100">
                                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Heures creuses</p>
                                {CONTRACT.hcPeriods.map((period, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-sm font-medium text-gray-900">{period}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Abonnement */}
                            <div className="mb-4 pb-4 border-b border-slate-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 uppercase font-medium">Abonnement</span>
                                    <span className="text-sm font-bold text-gray-900">{CONTRACT.subscription.toFixed(2)} €/mois</span>
                                </div>
                            </div>

                            {/* Grille tarifaire */}
                            <div className="mb-4 pb-4 border-b border-slate-100">
                                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Grille tarifaire (€/kWh)</p>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400 uppercase">
                                        <div></div>
                                        <div className="text-center">HC</div>
                                        <div className="text-center">HP</div>
                                    </div>
                                    {[
                                        { name: "Bleu", color: "bg-sky-500", ...CONTRACT.tarifs.bleu },
                                        { name: "Blanc", color: "bg-white border border-gray-300", ...CONTRACT.tarifs.blanc },
                                        { name: "Rouge", color: "bg-red-500", ...CONTRACT.tarifs.rouge },
                                    ].map((t) => (
                                        <div key={t.name} className="grid grid-cols-3 gap-2 items-center py-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                                                <span className="text-xs text-gray-700">{t.name}</span>
                                            </div>
                                            <div className={`text-center text-sm ${getPriceColor(t.hc)}`}>{t.hc.toFixed(3)}</div>
                                            <div className={`text-center text-sm ${getPriceColor(t.hp)}`}>{t.hp.toFixed(3)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Saison Tempo */}
                            {seasonStats && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">Saison {seasonStats.periode}</p>
                                    <div className="space-y-2">
                                        {[
                                            { name: "Bleu", color: "bg-sky-500", used: seasonStats.bleu, total: 300 },
                                            { name: "Blanc", color: "bg-white border border-gray-300", used: seasonStats.blanc, total: 43 },
                                            { name: "Rouge", color: "bg-red-500", used: seasonStats.rouge, total: 22 },
                                        ].map((t) => (
                                            <div key={t.name} className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.color}`} />
                                                <div className="flex-1">
                                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${t.color.includes("white") ? "bg-gray-400" : t.color}`}
                                                            style={{ width: `${(t.used / t.total) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-600 w-12 text-right font-medium">{t.used}/{t.total}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Section>
                    </div>
                </div>
            </div>
        </>
    );
}

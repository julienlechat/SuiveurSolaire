import { useEffect, useState, useMemo } from "react";
import { fetchHistoryGraph } from "../../api";

// Header avec SVG € simple
function PricingHeader() {
    return (
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 py-4 md:py-5">
            <div className="flex items-center">
                <div className="p-2 rounded-lg bg-emerald-100 mr-3">
                    <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2v-1.93c-1.86-.36-2.95-1.51-3.26-3.09h1.78c.23.82.88 1.51 2.28 1.51 1.36 0 1.87-.68 1.87-1.36 0-.97-.65-1.3-2.17-1.66-1.69-.39-3.24-.94-3.24-2.94 0-1.33.97-2.54 2.74-2.93V6h2v1.91c1.5.37 2.47 1.4 2.63 2.84h-1.75c-.13-.74-.63-1.34-1.67-1.34-1 0-1.68.48-1.68 1.25 0 .84.65 1.13 2.08 1.47 1.81.42 3.35 1.03 3.35 3.04 0 1.58-1.17 2.6-2.96 2.92z"/>
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Suivi des coûts</h2>
                    <p className="text-sm text-gray-500">Analyse et comparaison de votre consommation</p>
                </div>
            </div>
        </header>
    );
}

// Section card avec SVG
function Section({ icon, title, description, children, className = "" }) {
    return (
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">{icon}</div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                    {description && <p className="text-xs text-gray-500 truncate">{description}</p>}
                </div>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

// Données contrat Tempo
const CONTRACT = {
    name: "Tempo",
    provider: "EDF",
    startDate: "2024-09-01",
    subscription: 15.79, // €/mois pour 9kVA
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

    // Charger les données
    useEffect(() => {
        async function loadData() {
            try {
                const today = new Date();
                const dayOfWeek = today.getDay() || 7;

                // Charger semaine actuelle et précédente
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
                                // Estimation: 60% HP, 40% HC
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

                    setSeasonStats({
                        periode: `${startSeasonYear}-${startSeasonYear + 1}`,
                        bleu, blanc, rouge,
                    });
                }
            } catch (e) {
                console.error("Error loading data:", e);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Calculs comparatifs
    const comparison = useMemo(() => {
        const currentTotal = weekData.current.reduce((acc, d) => ({ 
            kwh: acc.kwh + d.kwh, 
            kwhHp: acc.kwhHp + d.kwhHp,
            kwhHc: acc.kwhHc + d.kwhHc,
            cost: acc.cost + d.cost,
            costHp: acc.costHp + d.costHp,
            costHc: acc.costHc + d.costHc,
        }), { kwh: 0, kwhHp: 0, kwhHc: 0, cost: 0, costHp: 0, costHc: 0 });
        
        const previousTotal = weekData.previous.reduce((acc, d) => ({ 
            kwh: acc.kwh + d.kwh, 
            kwhHp: acc.kwhHp + d.kwhHp,
            kwhHc: acc.kwhHc + d.kwhHc,
            cost: acc.cost + d.cost,
            costHp: acc.costHp + d.costHp,
            costHc: acc.costHc + d.costHc,
        }), { kwh: 0, kwhHp: 0, kwhHc: 0, cost: 0, costHp: 0, costHc: 0 });

        const kwhDiff = previousTotal.kwh > 0 ? ((currentTotal.kwh - previousTotal.kwh) / previousTotal.kwh * 100) : 0;
        const costDiff = previousTotal.cost > 0 ? ((currentTotal.cost - previousTotal.cost) / previousTotal.cost * 100) : 0;

        return { current: currentTotal, previous: previousTotal, kwhDiff, costDiff };
    }, [weekData]);

    // Trouver min/max des tarifs pour colorisation
    const allPrices = Object.values(CONTRACT.tarifs).flatMap(t => [t.hc, t.hp]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    const getPriceColor = (price) => {
        if (price === minPrice) return "text-emerald-600 font-semibold";
        if (price === maxPrice) return "text-rose-600 font-semibold";
        return "text-gray-900";
    };

    if (loading) {
        return (
            <>
                <PricingHeader />
                <div className="p-4 md:p-6">
                    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-xl border h-64" />
                            <div className="bg-white rounded-xl border h-64" />
                        </div>
                        <div className="bg-white rounded-xl border h-full min-h-[400px]" />
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
                    {/* ===== GRAPHIQUES (66%) ===== */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Graphique Consommation kWh */}
                        <Section
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            title="Consommation (kWh)"
                            description="Semaine en cours vs semaine précédente"
                        >
                            {/* Résumé */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xs text-blue-600 font-medium">Cette semaine</p>
                                    <p className="text-xl font-bold text-blue-700">{comparison.current.kwh.toFixed(1)} <span className="text-sm font-normal">kWh</span></p>
                                    <div className="flex gap-2 mt-1 text-xs text-blue-600">
                                        <span>HP: {comparison.current.kwhHp.toFixed(1)}</span>
                                        <span>HC: {comparison.current.kwhHc.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-gray-500 font-medium">Semaine précédente</p>
                                    <p className="text-xl font-bold text-gray-700">{comparison.previous.kwh.toFixed(1)} <span className="text-sm font-normal">kWh</span></p>
                                    <div className={`mt-1 text-xs ${comparison.kwhDiff > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                        {comparison.kwhDiff > 0 ? "+" : ""}{comparison.kwhDiff.toFixed(0)}%
                                    </div>
                                </div>
                            </div>
                            
                            {/* Barres comparatives */}
                            <div className="space-y-2">
                                {weekData.current.map((d, i) => {
                                    const prev = weekData.previous[i];
                                    const maxKwh = Math.max(...weekData.current.map(x => x.kwh), ...weekData.previous.map(x => x.kwh), 1);
                                    return (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="w-8 text-xs text-gray-500">{d.day}</span>
                                            <div className="flex-1 flex gap-1">
                                                <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden relative">
                                                    <div 
                                                        className="h-full bg-blue-500 rounded" 
                                                        style={{ width: `${(d.kwh / maxKwh) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden">
                                                    <div 
                                                        className="h-full bg-slate-400 rounded" 
                                                        style={{ width: `${((prev?.kwh || 0) / maxKwh) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="w-20 text-xs text-right">
                                                <span className="text-blue-600 font-medium">{d.kwh.toFixed(1)}</span>
                                                <span className="text-gray-400 mx-1">/</span>
                                                <span className="text-gray-500">{prev?.kwh.toFixed(1) || "0"}</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-4 mt-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded" /> Cette semaine</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-400 rounded" /> Semaine précédente</span>
                            </div>
                        </Section>

                        {/* Graphique Coût € */}
                        <Section
                            icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2v-1.93c-1.86-.36-2.95-1.51-3.26-3.09h1.78c.23.82.88 1.51 2.28 1.51 1.36 0 1.87-.68 1.87-1.36 0-.97-.65-1.3-2.17-1.66-1.69-.39-3.24-.94-3.24-2.94 0-1.33.97-2.54 2.74-2.93V6h2v1.91c1.5.37 2.47 1.4 2.63 2.84h-1.75c-.13-.74-.63-1.34-1.67-1.34-1 0-1.68.48-1.68 1.25 0 .84.65 1.13 2.08 1.47 1.81.42 3.35 1.03 3.35 3.04 0 1.58-1.17 2.6-2.96 2.92z"/></svg>}
                            title="Coût (€)"
                            description="Semaine en cours vs semaine précédente"
                        >
                            {/* Résumé */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="p-3 bg-emerald-50 rounded-lg">
                                    <p className="text-xs text-emerald-600 font-medium">Cette semaine</p>
                                    <p className="text-xl font-bold text-emerald-700">{comparison.current.cost.toFixed(2)} <span className="text-sm font-normal">€</span></p>
                                    <div className="flex gap-2 mt-1 text-xs text-emerald-600">
                                        <span>HP: {comparison.current.costHp.toFixed(2)}€</span>
                                        <span>HC: {comparison.current.costHc.toFixed(2)}€</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-gray-500 font-medium">Semaine précédente</p>
                                    <p className="text-xl font-bold text-gray-700">{comparison.previous.cost.toFixed(2)} <span className="text-sm font-normal">€</span></p>
                                    <div className={`mt-1 text-xs ${comparison.costDiff > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                        {comparison.costDiff > 0 ? "+" : ""}{comparison.costDiff.toFixed(0)}%
                                    </div>
                                </div>
                            </div>
                            
                            {/* Barres comparatives */}
                            <div className="space-y-2">
                                {weekData.current.map((d, i) => {
                                    const prev = weekData.previous[i];
                                    const maxCost = Math.max(...weekData.current.map(x => x.cost), ...weekData.previous.map(x => x.cost), 0.1);
                                    return (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="w-8 text-xs text-gray-500">{d.day}</span>
                                            <div className="flex-1 flex gap-1">
                                                <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden">
                                                    <div 
                                                        className="h-full bg-emerald-500 rounded" 
                                                        style={{ width: `${(d.cost / maxCost) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden">
                                                    <div 
                                                        className="h-full bg-slate-400 rounded" 
                                                        style={{ width: `${((prev?.cost || 0) / maxCost) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="w-24 text-xs text-right">
                                                <span className="text-emerald-600 font-medium">{d.cost.toFixed(2)}€</span>
                                                <span className="text-gray-400 mx-1">/</span>
                                                <span className="text-gray-500">{prev?.cost.toFixed(2) || "0"}€</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-4 mt-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded" /> Cette semaine</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-400 rounded" /> Semaine précédente</span>
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
                                    {/* En-tête */}
                                    <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400 uppercase">
                                        <div></div>
                                        <div className="text-center">HC</div>
                                        <div className="text-center">HP</div>
                                    </div>
                                    {/* Tarifs */}
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
                                            <div className={`text-center text-sm ${getPriceColor(t.hc)}`}>
                                                {t.hc.toFixed(3)}
                                            </div>
                                            <div className={`text-center text-sm ${getPriceColor(t.hp)}`}>
                                                {t.hp.toFixed(3)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Saison Tempo */}
                            {seasonStats && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                                        Saison {seasonStats.periode}
                                    </p>
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
                                                <span className="text-xs text-gray-600 w-12 text-right font-medium">
                                                    {t.used}/{t.total}
                                                </span>
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

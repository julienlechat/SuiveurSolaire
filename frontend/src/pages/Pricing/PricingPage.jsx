import { useEffect, useState, useMemo } from "react";
import { fetchHistoryGraph } from "../../api";

// Header avec SVG €
function PricingHeader() {
    return (
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 py-4 md:py-5">
            <div className="flex items-center">
                <div className="p-2 rounded-lg bg-emerald-100 mr-3">
                    <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Tarification</h2>
                    <p className="text-sm text-gray-500">Analyse des coûts et consommation</p>
                </div>
            </div>
        </header>
    );
}

// Carte KPI compacte
function KpiCard({ label, value, unit, subtext, warning, icon, color = "blue" }) {
    const colors = {
        blue: { icon: "bg-blue-100 text-blue-600" },
        emerald: { icon: "bg-emerald-100 text-emerald-600" },
        amber: { icon: "bg-amber-100 text-amber-600" },
        rose: { icon: "bg-rose-100 text-rose-600" },
        purple: { icon: "bg-purple-100 text-purple-600" },
    };
    const c = colors[color] || colors.blue;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${c.icon}`}>{icon}</div>
                <span className="text-xs text-gray-500 font-medium uppercase">{label}</span>
                {warning && (
                    <svg className="w-4 h-4 text-amber-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                )}
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span className="text-sm text-gray-500">{unit}</span>
            </div>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
    );
}

// Section card avec SVG obligatoire
function Section({ icon, title, description, children, compact = false }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className={`px-4 ${compact ? "py-3" : "py-4"} border-b border-slate-100 flex items-center gap-2`}>
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">{icon}</div>
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                    {description && <p className="text-xs text-gray-500">{description}</p>}
                </div>
            </div>
            <div className={compact ? "p-3" : "p-4"}>{children}</div>
        </div>
    );
}

// Tarifs Tempo
const TEMPO_TARIFS = {
    bleu: { hc: 0.1296, hp: 0.1609 },
    blanc: { hc: 0.1486, hp: 0.1894 },
    rouge: { hc: 0.1568, hp: 0.7562 },
};

export default function PricingPage() {
    const [loading, setLoading] = useState(true);
    const [seasonStats, setSeasonStats] = useState(null);
    const [monthData, setMonthData] = useState({ days: [], totalKwh: 0, totalCost: 0, missingDays: 0 });
    const [weekData, setWeekData] = useState({ current: [], previous: [] });

    // Charger les données
    useEffect(() => {
        async function loadData() {
            try {
                const today = new Date();
                const currentYear = today.getFullYear();
                const currentMonth = today.getMonth();
                const currentDay = today.getDate();

                // Charger données du mois (chaque jour)
                const monthDays = [];
                let totalKwh = 0;
                let totalCost = 0;
                let missingDays = 0;

                for (let d = 1; d <= currentDay; d++) {
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                    try {
                        const data = await fetchHistoryGraph(dateStr);
                        if (data.ok && data.stats) {
                            const dayKwh = Number(data.stats.totalConsumption) || 0;
                            // Estimation coût (simplifié avec tarif bleu moyen)
                            const avgPrice = (TEMPO_TARIFS.bleu.hp * 0.6 + TEMPO_TARIFS.bleu.hc * 0.4);
                            const dayCost = dayKwh * avgPrice;
                            monthDays.push({ date: dateStr, kwh: dayKwh, cost: dayCost });
                            totalKwh += dayKwh;
                            totalCost += dayCost;
                        } else {
                            missingDays++;
                            monthDays.push({ date: dateStr, kwh: 0, cost: 0, missing: true });
                        }
                    } catch {
                        missingDays++;
                        monthDays.push({ date: dateStr, kwh: 0, cost: 0, missing: true });
                    }
                }

                setMonthData({ days: monthDays, totalKwh, totalCost, missingDays, daysCount: currentDay });

                // Charger semaine actuelle vs précédente
                const currentWeek = [];
                const previousWeek = [];
                const dayOfWeek = today.getDay() || 7; // 1=Lundi, 7=Dimanche

                for (let i = 1; i <= 7; i++) {
                    // Semaine actuelle
                    const currentDate = new Date(today);
                    currentDate.setDate(today.getDate() - dayOfWeek + i);
                    if (currentDate <= today) {
                        const dateStr = currentDate.toISOString().split("T")[0];
                        try {
                            const data = await fetchHistoryGraph(dateStr);
                            if (data.ok && data.stats) {
                                currentWeek.push({
                                    day: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i - 1],
                                    kwh: Number(data.stats.totalConsumption) || 0,
                                    cost: (Number(data.stats.totalConsumption) || 0) * (TEMPO_TARIFS.bleu.hp * 0.6 + TEMPO_TARIFS.bleu.hc * 0.4)
                                });
                            }
                        } catch {}
                    }

                    // Semaine précédente
                    const prevDate = new Date(today);
                    prevDate.setDate(today.getDate() - dayOfWeek + i - 7);
                    const prevDateStr = prevDate.toISOString().split("T")[0];
                    try {
                        const data = await fetchHistoryGraph(prevDateStr);
                        if (data.ok && data.stats) {
                            previousWeek.push({
                                day: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i - 1],
                                kwh: Number(data.stats.totalConsumption) || 0,
                                cost: (Number(data.stats.totalConsumption) || 0) * (TEMPO_TARIFS.bleu.hp * 0.6 + TEMPO_TARIFS.bleu.hc * 0.4)
                            });
                        }
                    } catch {}
                }

                setWeekData({ current: currentWeek, previous: previousWeek });

                // Stats saison Tempo
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
                        bleuRestant: 300 - bleu,
                        blancRestant: 43 - blanc,
                        rougeRestant: 22 - rouge,
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

    // Calculs KPIs
    const kpis = useMemo(() => {
        if (!monthData.days.length) return null;

        const avgKwhPerDay = monthData.daysCount > 0 ? monthData.totalKwh / (monthData.daysCount - monthData.missingDays || 1) : 0;
        const avgCostPerDay = monthData.daysCount > 0 ? monthData.totalCost / (monthData.daysCount - monthData.missingDays || 1) : 0;

        // Trouver pic et creux
        const validDays = monthData.days.filter(d => !d.missing && d.kwh > 0);
        const peakDay = validDays.length ? validDays.reduce((a, b) => a.kwh > b.kwh ? a : b) : null;
        const lowDay = validDays.length ? validDays.reduce((a, b) => a.kwh < b.kwh ? a : b) : null;

        return {
            totalCost: monthData.totalCost.toFixed(2),
            totalKwh: monthData.totalKwh.toFixed(1),
            avgCostPerDay: avgCostPerDay.toFixed(2),
            avgKwhPerDay: avgKwhPerDay.toFixed(1),
            missingDays: monthData.missingDays,
            peakDay: peakDay ? new Date(peakDay.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—",
            peakKwh: peakDay?.kwh.toFixed(1) || "—",
            lowDay: lowDay ? new Date(lowDay.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—",
            lowKwh: lowDay?.kwh.toFixed(1) || "—",
        };
    }, [monthData]);

    // Comparaison semaine
    const weekComparison = useMemo(() => {
        const currentTotal = weekData.current.reduce((acc, d) => acc + d.kwh, 0);
        const previousTotal = weekData.previous.reduce((acc, d) => acc + d.kwh, 0);
        const diff = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal * 100).toFixed(0) : 0;
        return { currentTotal: currentTotal.toFixed(1), previousTotal: previousTotal.toFixed(1), diff };
    }, [weekData]);

    if (loading) {
        return (
            <>
                <PricingHeader />
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map(i => <div key={i} className="bg-white rounded-xl border h-24" />)}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl border h-48" />
                            <div className="bg-white rounded-xl border h-48" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PricingHeader />
            
            <div className="p-6 space-y-4">
                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <KpiCard
                        label="Coût du mois"
                        value={kpis?.totalCost || "—"}
                        unit="€"
                        subtext={`${monthData.daysCount} jours`}
                        warning={monthData.missingDays > 0}
                        color="emerald"
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4" /></svg>}
                    />
                    <KpiCard
                        label="Coût moyen/jour"
                        value={kpis?.avgCostPerDay || "—"}
                        unit="€"
                        color="blue"
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    />
                    <KpiCard
                        label="Conso. moyenne"
                        value={kpis?.avgKwhPerDay || "—"}
                        unit="kWh/j"
                        color="amber"
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    />
                    <KpiCard
                        label="Pic conso."
                        value={kpis?.peakKwh || "—"}
                        unit="kWh"
                        subtext={kpis?.peakDay}
                        color="rose"
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                    />
                </div>

                {/* Grille principale */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Infos contrat (fusionné grille + HP/HC) */}
                    <Section
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        title="Infos contrat"
                        compact
                    >
                        <div className="space-y-2 text-sm">
                            {/* Horaires */}
                            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                                <span className="text-gray-500">Heures pleines</span>
                                <span className="font-medium text-amber-600">06h - 22h</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                                <span className="text-gray-500">Heures creuses</span>
                                <span className="font-medium text-emerald-600">22h - 06h</span>
                            </div>
                            {/* Tarifs */}
                            <div className="pt-2 grid grid-cols-3 gap-2 text-xs">
                                <div></div>
                                <div className="text-center text-gray-400">HC</div>
                                <div className="text-center text-gray-400">HP</div>
                            </div>
                            {[
                                { color: "sky", name: "Bleu", ...TEMPO_TARIFS.bleu },
                                { color: "gray", name: "Blanc", ...TEMPO_TARIFS.blanc },
                                { color: "red", name: "Rouge", ...TEMPO_TARIFS.rouge },
                            ].map(t => (
                                <div key={t.name} className="grid grid-cols-3 gap-2 text-xs py-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${t.color === "gray" ? "bg-white border border-gray-400" : `bg-${t.color}-500`}`}></span>
                                        <span className="text-gray-700">{t.name}</span>
                                    </div>
                                    <div className="text-center font-medium">{t.hc.toFixed(2)}€</div>
                                    <div className={`text-center font-medium ${t.name === "Rouge" ? "text-rose-600" : ""}`}>{t.hp.toFixed(2)}€</div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Saison Tempo compact */}
                    <Section
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        title="Saison Tempo"
                        description={seasonStats?.periode}
                        compact
                    >
                        <div className="space-y-2">
                            {[
                                { color: "sky", name: "Bleu", used: seasonStats?.bleu || 0, total: 300 },
                                { color: "gray", name: "Blanc", used: seasonStats?.blanc || 0, total: 43 },
                                { color: "red", name: "Rouge", used: seasonStats?.rouge || 0, total: 22 },
                            ].map(t => (
                                <div key={t.name} className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.color === "gray" ? "bg-white border border-gray-400" : `bg-${t.color}-500`}`}></span>
                                    <div className="flex-1">
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${t.color === "gray" ? "bg-gray-400" : `bg-${t.color}-500`} rounded-full`} style={{ width: `${(t.used / t.total) * 100}%` }} />
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-600 w-14 text-right">{t.used}/{t.total}</span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Comparaison semaine */}
                    <Section
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                        title="Cette semaine"
                        description={`vs semaine précédente`}
                        compact
                    >
                        <div className="text-center py-2">
                            <div className="text-2xl font-bold text-gray-900">{weekComparison.currentTotal} <span className="text-sm font-normal text-gray-500">kWh</span></div>
                            <div className={`text-sm mt-1 ${Number(weekComparison.diff) > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                {Number(weekComparison.diff) > 0 ? "+" : ""}{weekComparison.diff}% vs {weekComparison.previousTotal} kWh
                            </div>
                        </div>
                        {/* Mini barres par jour */}
                        <div className="flex justify-between gap-1 mt-3">
                            {weekData.current.map((d, i) => (
                                <div key={i} className="flex-1 text-center">
                                    <div className="h-12 flex items-end justify-center">
                                        <div 
                                            className="w-full max-w-4 bg-blue-500 rounded-t" 
                                            style={{ height: `${Math.max(4, (d.kwh / Math.max(...weekData.current.map(x => x.kwh), 1)) * 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-[9px] text-gray-400">{d.day}</span>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* Détails par jour du mois */}
                <Section
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}
                    title="Détails du mois"
                    description="Consommation et coût par jour"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 border-b border-slate-100">
                                    <th className="text-left py-2 font-medium">Date</th>
                                    <th className="text-right py-2 font-medium">Conso.</th>
                                    <th className="text-right py-2 font-medium">Coût</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthData.days.slice(-10).reverse().map((d, i) => (
                                    <tr key={i} className={`border-b border-slate-50 ${d.missing ? "opacity-50" : ""}`}>
                                        <td className="py-2 text-gray-700">
                                            {new Date(d.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                                            {d.missing && <span className="ml-1 text-amber-500 text-xs">(incomplet)</span>}
                                        </td>
                                        <td className="py-2 text-right font-medium">{d.kwh.toFixed(1)} kWh</td>
                                        <td className="py-2 text-right font-medium text-emerald-600">{d.cost.toFixed(2)} €</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-slate-200 font-semibold">
                                    <td className="py-2">Total</td>
                                    <td className="py-2 text-right">{monthData.totalKwh.toFixed(1)} kWh</td>
                                    <td className="py-2 text-right text-emerald-600">{monthData.totalCost.toFixed(2)} €</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Section>
            </div>
        </>
    );
}

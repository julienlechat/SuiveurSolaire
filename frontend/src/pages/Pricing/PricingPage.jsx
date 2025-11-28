import { useEffect, useState, useMemo } from "react";

// Header spécifique pour la tarification
function PricingHeader() {
    return (
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 py-4 md:py-5">
            <div className="flex items-center">
                <div className="p-2 rounded-lg bg-emerald-100 mr-3">
                    <svg 
                        className="h-5 w-5 text-emerald-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Tarification</h2>
                    <p className="text-sm text-gray-500">Analyse des coûts et statistiques détaillées</p>
                </div>
            </div>
        </header>
    );
}

// Carte KPI
function KpiCard({ label, value, unit, trend, trendValue, icon, color = "blue" }) {
    const colors = {
        blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-100" },
        emerald: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "bg-emerald-100" },
        amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "bg-amber-100" },
        rose: { bg: "bg-rose-50", text: "text-rose-600", icon: "bg-rose-100" },
        purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "bg-purple-100" },
        slate: { bg: "bg-slate-50", text: "text-slate-600", icon: "bg-slate-100" },
    };
    const c = colors[color] || colors.blue;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${c.icon} ${c.text}`}>
                    {icon}
                </div>
                <span className="text-xs text-gray-500 font-medium uppercase">{label}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span className="text-sm text-gray-500">{unit}</span>
            </div>
            {trend && (
                <div className={`flex items-center gap-1 mt-2 text-xs ${
                    trend === "up" ? "text-rose-600" : trend === "down" ? "text-emerald-600" : "text-gray-500"
                }`}>
                    {trend === "up" && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    )}
                    {trend === "down" && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                    <span>{trendValue}</span>
                </div>
            )}
        </div>
    );
}

// Section card
function Section({ title, description, children }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

// Tarifs Tempo (valeurs de référence)
const TEMPO_TARIFS = {
    bleu: { hc: 0.1296, hp: 0.1609 },
    blanc: { hc: 0.1486, hp: 0.1894 },
    rouge: { hc: 0.1568, hp: 0.7562 },
};

export default function PricingPage() {
    const [tempoData, setTempoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seasonStats, setSeasonStats] = useState(null);

    // Charger les données Tempo
    useEffect(() => {
        async function loadData() {
            try {
                // Charger les stats de la saison Tempo
                const today = new Date();
                const currentYear = today.getFullYear();
                let startSeasonYear = currentYear;
                if (today.getMonth() < 8) startSeasonYear--;

                const res = await fetch("https://www.api-couleur-tempo.fr/api/joursTempo");
                if (res.ok) {
                    const allDays = await res.json();
                    
                    const startDate = new Date(startSeasonYear, 8, 1);
                    const endDate = new Date(startSeasonYear + 1, 7, 31);

                    let bleu = 0, blanc = 0, rouge = 0;
                    let bleuTotal = 0, blancTotal = 0, rougeTotal = 0;

                    allDays.forEach(day => {
                        const dayDate = new Date(day.dateJour);
                        if (dayDate >= startDate && dayDate <= endDate) {
                            const color = (day.libCouleur || day.couleur)?.toUpperCase();
                            if (color === "BLEU") bleuTotal++;
                            if (color === "BLANC") blancTotal++;
                            if (color === "ROUGE") rougeTotal++;

                            if (dayDate <= today) {
                                if (color === "BLEU") bleu++;
                                if (color === "BLANC") blanc++;
                                if (color === "ROUGE") rouge++;
                            }
                        }
                    });

                    setSeasonStats({
                        periode: `${startSeasonYear}-${startSeasonYear + 1}`,
                        bleu, blanc, rouge,
                        bleuTotal: 300, blancTotal: 43, rougeTotal: 22,
                        bleuRestant: 300 - bleu,
                        blancRestant: 43 - blanc,
                        rougeRestant: 22 - rouge,
                    });
                }

                // Charger couleur aujourd'hui
                const todayRes = await fetch("https://www.api-couleur-tempo.fr/api/jourTempo/today");
                if (todayRes.ok) {
                    const data = await todayRes.json();
                    setTempoData(data);
                }
            } catch (e) {
                console.error("Error loading tempo data:", e);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Calcul du coût estimé du mois
    const monthEstimate = useMemo(() => {
        if (!seasonStats) return null;

        // Estimation basique : 15 kWh/jour en moyenne
        const avgDailyKwh = 15;
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        const currentDay = new Date().getDate();

        // Répartition estimée HP/HC : 60% HP, 40% HC
        const hpRatio = 0.6;
        const hcRatio = 0.4;

        // Coût moyen pondéré (approximation avec les jours bleus majoritaires)
        const avgPriceHp = TEMPO_TARIFS.bleu.hp;
        const avgPriceHc = TEMPO_TARIFS.bleu.hc;

        const dailyCost = avgDailyKwh * (hpRatio * avgPriceHp + hcRatio * avgPriceHc);
        const currentMonthCost = dailyCost * currentDay;
        const projectedMonthCost = dailyCost * daysInMonth;

        return {
            currentCost: currentMonthCost.toFixed(2),
            projectedCost: projectedMonthCost.toFixed(2),
            avgDailyCost: dailyCost.toFixed(2),
            currentDay,
            daysInMonth,
        };
    }, [seasonStats]);

    if (loading) {
        return (
            <>
                <PricingHeader />
                <div className="p-6">
                    <div className="animate-pulse space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 h-28" />
                            ))}
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 h-64" />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PricingHeader />
            
            <div className="p-6 space-y-6">
                {/* KPIs du mois */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        label="Coût ce mois"
                        value={monthEstimate?.currentCost || "—"}
                        unit="€"
                        trend="up"
                        trendValue={`Jour ${monthEstimate?.currentDay}/${monthEstimate?.daysInMonth}`}
                        color="emerald"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <KpiCard
                        label="Projection fin mois"
                        value={monthEstimate?.projectedCost || "—"}
                        unit="€"
                        color="blue"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                    />
                    <KpiCard
                        label="Coût moyen/jour"
                        value={monthEstimate?.avgDailyCost || "—"}
                        unit="€/j"
                        color="amber"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }
                    />
                    <KpiCard
                        label="Jours rouges restants"
                        value={seasonStats?.rougeRestant || "—"}
                        unit="jours"
                        color="rose"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        }
                    />
                </div>

                {/* Grille 2 colonnes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tarifs Tempo */}
                    <Section title="Grille tarifaire Tempo" description="Prix du kWh selon la couleur du jour">
                        <div className="space-y-3">
                            {/* En-tête */}
                            <div className="grid grid-cols-3 gap-4 pb-2 border-b border-slate-100">
                                <div className="text-xs text-gray-500 font-medium">COULEUR</div>
                                <div className="text-xs text-gray-500 font-medium text-center">HEURES CREUSES</div>
                                <div className="text-xs text-gray-500 font-medium text-center">HEURES PLEINES</div>
                            </div>
                            
                            {/* Bleu */}
                            <div className="grid grid-cols-3 gap-4 items-center py-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                                    <span className="font-medium text-gray-900">Bleu</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-semibold text-gray-900">{TEMPO_TARIFS.bleu.hc.toFixed(4)}</span>
                                    <span className="text-xs text-gray-500 ml-1">€</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-semibold text-gray-900">{TEMPO_TARIFS.bleu.hp.toFixed(4)}</span>
                                    <span className="text-xs text-gray-500 ml-1">€</span>
                                </div>
                            </div>

                            {/* Blanc */}
                            <div className="grid grid-cols-3 gap-4 items-center py-2 bg-slate-50 -mx-6 px-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-white border-2 border-gray-300"></span>
                                    <span className="font-medium text-gray-900">Blanc</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-semibold text-gray-900">{TEMPO_TARIFS.blanc.hc.toFixed(4)}</span>
                                    <span className="text-xs text-gray-500 ml-1">€</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-semibold text-gray-900">{TEMPO_TARIFS.blanc.hp.toFixed(4)}</span>
                                    <span className="text-xs text-gray-500 ml-1">€</span>
                                </div>
                            </div>

                            {/* Rouge */}
                            <div className="grid grid-cols-3 gap-4 items-center py-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <span className="font-medium text-gray-900">Rouge</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-semibold text-gray-900">{TEMPO_TARIFS.rouge.hc.toFixed(4)}</span>
                                    <span className="text-xs text-gray-500 ml-1">€</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-semibold text-rose-600 font-bold">{TEMPO_TARIFS.rouge.hp.toFixed(4)}</span>
                                    <span className="text-xs text-rose-500 ml-1">€</span>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Stats saison Tempo */}
                    <Section title="Saison Tempo" description={`Période ${seasonStats?.periode || "—"}`}>
                        <div className="space-y-4">
                            {/* Jours Bleus */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                                        <span className="text-sm font-medium text-gray-700">Jours Bleus</span>
                                    </div>
                                    <span className="text-sm text-gray-900 font-semibold">
                                        {seasonStats?.bleu || 0} / 300
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-sky-500 rounded-full transition-all"
                                        style={{ width: `${((seasonStats?.bleu || 0) / 300) * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {seasonStats?.bleuRestant || 300} jours restants
                                </p>
                            </div>

                            {/* Jours Blancs */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-gray-300"></span>
                                        <span className="text-sm font-medium text-gray-700">Jours Blancs</span>
                                    </div>
                                    <span className="text-sm text-gray-900 font-semibold">
                                        {seasonStats?.blanc || 0} / 43
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gray-400 rounded-full transition-all"
                                        style={{ width: `${((seasonStats?.blanc || 0) / 43) * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {seasonStats?.blancRestant || 43} jours restants
                                </p>
                            </div>

                            {/* Jours Rouges */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                        <span className="text-sm font-medium text-gray-700">Jours Rouges</span>
                                    </div>
                                    <span className="text-sm text-gray-900 font-semibold">
                                        {seasonStats?.rouge || 0} / 22
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-red-500 rounded-full transition-all"
                                        style={{ width: `${((seasonStats?.rouge || 0) / 22) * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {seasonStats?.rougeRestant || 22} jours restants
                                </p>
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Informations sur les heures */}
                <Section title="Horaires HP/HC" description="Heures pleines et heures creuses Tempo">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-amber-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-amber-800">Heures Pleines</p>
                                    <p className="text-xs text-amber-600">Tarif normal</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-amber-900">06h00 - 22h00</p>
                            <p className="text-sm text-amber-700 mt-1">16 heures par jour</p>
                        </div>

                        <div className="p-4 bg-emerald-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-emerald-800">Heures Creuses</p>
                                    <p className="text-xs text-emerald-600">Tarif réduit</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-emerald-900">22h00 - 06h00</p>
                            <p className="text-sm text-emerald-700 mt-1">8 heures par jour</p>
                        </div>
                    </div>
                </Section>

                {/* Conseils */}
                <Section title="Conseils d'optimisation" description="Réduisez votre facture avec ces bonnes pratiques">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-sky-600 font-bold text-xs">1</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Programmez vos appareils énergivores</p>
                                <p className="text-sm text-gray-500">Lancez lave-linge, sèche-linge et lave-vaisselle en heures creuses (22h-6h)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-amber-600 font-bold text-xs">2</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Surveillez les jours rouges</p>
                                <p className="text-sm text-gray-500">Les HP rouges coûtent 4x plus cher que les HP bleus - réduisez au maximum</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-emerald-600 font-bold text-xs">3</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Chargez vos batteries</p>
                                <p className="text-sm text-gray-500">Rechargez véhicule électrique et batteries domestiques en HC bleu</p>
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        </>
    );
}


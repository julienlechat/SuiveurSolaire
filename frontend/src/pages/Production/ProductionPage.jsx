import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchLatest, fetchHistoryGraph } from "../../api";
import ProductionChart from "../../components/ProductionChart";
import DatePicker from "../../components/DatePicker";

// ─── Icônes ──────────────────────────────────────────────────────────────────

const BoltIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.718a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .945-.143Z" clipRule="evenodd" />
    </svg>
);

const SunIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.36-.71.71M5.64 18.36l-.71.71m12.73 0-.71-.71M5.64 5.64l-.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />
    </svg>
);

const ArrowUpIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
    </svg>
);

const HomeIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </svg>
);

// ─── Sous-composants ─────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, unit, sub, color = "amber", loading }) {
    const colors = {
        amber:   { bg: "bg-amber-50",   icon: "bg-amber-100 text-amber-600",   val: "text-amber-700" },
        emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", val: "text-emerald-700" },
        slate:   { bg: "bg-slate-50",   icon: "bg-slate-100 text-slate-600",   val: "text-slate-700" },
        blue:    { bg: "bg-blue-50",    icon: "bg-blue-100 text-blue-600",     val: "text-blue-700" },
    };
    const c = colors[color] ?? colors.amber;

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-3" />
                <div className="h-7 bg-slate-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
        );
    }

    return (
        <div className={`rounded-xl border border-slate-200 p-4 ${c.bg}`}>
            <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${c.icon}`}>{icon}</div>
                <span className="text-xs font-medium text-gray-500">{label}</span>
            </div>
            <p className={`text-2xl font-bold ${c.val}`}>
                {value !== null && value !== undefined ? value : "—"}
                {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
            </p>
            {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
    );
}

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

// ─── Page principale ─────────────────────────────────────────────────────────

export default function ProductionPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    // Dernières mesures (pour identifier les producteurs)
    const [latestPoints, setLatestPoints] = useState([]);

    // Données du jour sélectionné
    const [graphData, setGraphData]     = useState(null);
    const [loadingDay, setLoadingDay]   = useState(true);

    // Données hebdomadaires
    const [weekData, setWeekData]         = useState({ current: [], previous: [] });
    const [loadingWeek, setLoadingWeek]   = useState(true);

    // ── Chargement des dernières mesures ──────────────────────────────────────
    useEffect(() => {
        fetchLatest()
            .then((data) => { if (data.ok) setLatestPoints(data.points || []); })
            .catch(() => {});
    }, []);

    // IDs des producteurs (Set)
    const producerIds = useMemo(
        () => new Set(latestPoints.filter((p) => p.is_producer).map((p) => p.point_id)),
        [latestPoints]
    );

    // ── Chargement du jour ────────────────────────────────────────────────────
    const loadDay = useCallback(async (date) => {
        setLoadingDay(true);
        try {
            const data = await fetchHistoryGraph(date);
            if (data.ok) setGraphData(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingDay(false);
        }
    }, []);

    useEffect(() => { loadDay(selectedDate); }, [selectedDate, loadDay]);

    // ── Chargement hebdomadaire ───────────────────────────────────────────────
    useEffect(() => {
        async function loadWeek() {
            setLoadingWeek(true);
            const today      = new Date();
            const dayOfWeek  = today.getDay() || 7;
            const dayNames   = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
            const current    = [];
            const previous   = [];

            for (let i = 1; i <= 7; i++) {
                const curDate = new Date(today);
                curDate.setDate(today.getDate() - dayOfWeek + i);

                const prevDate = new Date(today);
                prevDate.setDate(today.getDate() - dayOfWeek + i - 7);

                const fetchDay = async (d) => {
                    const dateStr = d.toISOString().split("T")[0];
                    try {
                        const data = await fetchHistoryGraph(dateStr);
                        if (data.ok && data.stats) {
                            const producers = (data.stats.pointStats || []).filter((p) => p.is_producer);
                            const consumers = (data.stats.pointStats || []).filter((p) => !p.is_producer);
                            const prod  = producers.reduce((s, p) => s + (p.export_kwh || 0), 0);
                            const grid  = consumers.reduce((s, p) => s + (p.import_kwh || 0), 0);
                            const exp   = consumers.reduce((s, p) => s + (p.export_kwh || 0), 0);
                            const auto  = Math.max(0, prod - exp);
                            return { day: dayNames[i - 1], date: dateStr, prod, grid, auto, exported: exp };
                        }
                    } catch { /* silence */ }
                    return { day: dayNames[i - 1], date: dateStr, prod: 0, grid: 0, auto: 0, exported: 0 };
                };

                const [curDay, prevDay] = await Promise.all([fetchDay(curDate), fetchDay(prevDate)]);
                if (curDate <= today) current.push(curDay);
                previous.push(prevDay);
            }

            setWeekData({ current, previous });
            setLoadingWeek(false);
        }
        loadWeek();
    }, []);

    // ── KPIs du jour ─────────────────────────────────────────────────────────
    const kpis = useMemo(() => {
        if (!graphData?.stats?.pointStats) return null;
        const ps = graphData.stats.pointStats;
        const producers = ps.filter((p) => p.is_producer);
        const consumers = ps.filter((p) => !p.is_producer);
        const prod     = producers.reduce((s, p) => s + (p.export_kwh || 0), 0);
        const grid     = consumers.reduce((s, p) => s + (p.import_kwh || 0), 0);
        const exported = consumers.reduce((s, p) => s + (p.export_kwh || 0), 0);
        const auto     = Math.max(0, prod - exported);
        const coverage = (grid + auto) > 0 ? (auto / (grid + auto)) * 100 : 0;
        const selfRate = prod > 0 ? (auto / prod) * 100 : 0;
        return { prod, grid, exported, auto, coverage, selfRate };
    }, [graphData]);

    // ── Comparatif hebdo ─────────────────────────────────────────────────────
    const weekTotals = useMemo(() => {
        const sum = (arr) => arr.reduce((s, d) => ({ prod: s.prod + d.prod, auto: s.auto + d.auto }), { prod: 0, auto: 0 });
        const cur  = sum(weekData.current);
        const prev = sum(weekData.previous);
        const diff = prev.prod > 0 ? ((cur.prod - prev.prod) / prev.prod) * 100 : 0;
        return { cur, prev, diff };
    }, [weekData]);

    const maxWeekProd = useMemo(
        () => Math.max(...weekData.current.map((d) => d.prod), ...weekData.previous.map((d) => d.prod), 1),
        [weekData]
    );

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 py-4 md:py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-amber-100 mr-3">
                            <BoltIcon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Production d'énergie</h2>
                            <p className="text-sm text-gray-500">Suivi de vos sources de production</p>
                        </div>
                    </div>
                    <DatePicker value={selectedDate} onChange={setSelectedDate} />
                </div>
            </header>

            <div className="p-4 md:p-6 space-y-6">

                {/* ── KPIs ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        icon={<BoltIcon className="w-4 h-4" />}
                        label="Produit"
                        value={kpis ? kpis.prod.toFixed(2) : null}
                        unit="kWh"
                        color="amber"
                        loading={loadingDay}
                    />
                    <KpiCard
                        icon={<HomeIcon className="w-4 h-4" />}
                        label="Autoconsommé"
                        value={kpis ? kpis.auto.toFixed(2) : null}
                        unit="kWh"
                        sub={kpis ? `${kpis.selfRate.toFixed(0)}% de la production` : null}
                        color="emerald"
                        loading={loadingDay}
                    />
                    <KpiCard
                        icon={<ArrowUpIcon className="w-4 h-4" />}
                        label="Exporté réseau"
                        value={kpis ? kpis.exported.toFixed(2) : null}
                        unit="kWh"
                        color="slate"
                        loading={loadingDay}
                    />
                    <KpiCard
                        icon={<SunIcon className="w-4 h-4" />}
                        label="Couverture solaire"
                        value={kpis ? kpis.coverage.toFixed(0) : null}
                        unit="%"
                        sub={kpis ? `${kpis.grid.toFixed(2)} kWh du réseau` : null}
                        color="blue"
                        loading={loadingDay}
                    />
                </div>

                {/* ── Graphique + détail producteurs ── */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 min-h-[360px] lg:min-h-0">
                        <ProductionChart
                            measurements={graphData?.measurements}
                            producerIds={producerIds}
                            loading={loadingDay}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <Section
                            icon={<BoltIcon className="w-4 h-4" />}
                            title="Sources de production"
                            className="h-full"
                        >
                            {loadingDay ? (
                                <div className="space-y-3 animate-pulse">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="h-14 bg-slate-100 rounded-lg" />
                                    ))}
                                </div>
                            ) : graphData?.stats?.pointStats?.filter((p) => p.is_producer).length === 0 ? (
                                <p className="text-sm text-gray-400">Aucun producteur détecté</p>
                            ) : (
                                <div className="space-y-3">
                                    {graphData?.stats?.pointStats
                                        ?.filter((p) => p.is_producer)
                                        .map((p) => (
                                            <div key={p.point_id} className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                                                <p className="text-sm font-semibold text-gray-800">{p.point_name}</p>
                                                <div className="mt-1 space-y-0.5 text-xs text-gray-600">
                                                    <div className="flex justify-between">
                                                        <span>Produit</span>
                                                        <span className="font-medium text-amber-700">{(p.export_kwh || 0).toFixed(2)} kWh</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Pic</span>
                                                        <span className="font-medium">{(p.max_power || 0).toFixed(0)} W</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Moyenne</span>
                                                        <span className="font-medium">{(p.avg_power || 0).toFixed(0)} W</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    {/* Bilan net journalier */}
                                    {kpis && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                            <p className="text-xs font-medium text-gray-500 uppercase">Bilan du jour</p>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-600">Autoconsommé</span>
                                                <span className="font-semibold text-emerald-600">{kpis.auto.toFixed(2)} kWh</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-600">Exporté réseau</span>
                                                <span className="font-medium text-slate-600">{kpis.exported.toFixed(2)} kWh</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-600">Couverture</span>
                                                <span className="font-semibold text-blue-600">{kpis.coverage.toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Section>
                    </div>
                </div>

                {/* ── Comparatif hebdomadaire ── */}
                <Section
                    icon={<BoltIcon className="w-4 h-4" />}
                    title="Comparatif hebdomadaire"
                    description="Production cette semaine vs semaine précédente"
                    headerRight={
                        !loadingWeek && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                weekTotals.diff > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                            }`}>
                                {weekTotals.diff > 0 ? "+" : ""}{weekTotals.diff.toFixed(0)}%
                            </span>
                        )
                    }
                >
                    {loadingWeek ? (
                        <div className="space-y-3 animate-pulse">
                            {[1,2,3,4,5].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-3 bg-slate-200 rounded" />
                                    <div className="flex-1 h-6 bg-slate-100 rounded" />
                                    <div className="w-20 h-3 bg-slate-100 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Résumé totaux */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-xl bg-amber-50">
                                    <p className="text-xs font-medium text-amber-600">Cette semaine</p>
                                    <p className="text-2xl font-bold text-amber-700">{weekTotals.cur.prod.toFixed(1)} kWh</p>
                                    <p className="text-xs text-amber-600 mt-0.5">dont {weekTotals.cur.auto.toFixed(1)} kWh autoconsommés</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50">
                                    <p className="text-xs font-medium text-gray-500">Semaine précédente</p>
                                    <p className="text-2xl font-bold text-gray-700">{weekTotals.prev.prod.toFixed(1)} kWh</p>
                                    <div className={`text-xs font-semibold mt-0.5 ${weekTotals.diff > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                        {weekTotals.diff > 0 ? "+" : ""}{weekTotals.diff.toFixed(0)}% vs sem. précédente
                                    </div>
                                </div>
                            </div>

                            {/* Barres par jour */}
                            <div className="space-y-3">
                                {weekData.current.map((d, i) => {
                                    const prev = weekData.previous[i] || { prod: 0 };
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-8 text-xs text-gray-500 font-medium">{d.day}</span>
                                            <div className="flex-1 flex gap-2">
                                                <Tooltip
                                                    className="flex-1"
                                                    content={
                                                        <div className="text-center">
                                                            <div className="font-semibold">{d.day} (cette semaine)</div>
                                                            <div>Production: {d.prod.toFixed(2)} kWh</div>
                                                            <div>Autoconsommé: {d.auto.toFixed(2)} kWh</div>
                                                        </div>
                                                    }
                                                >
                                                    <div className="h-6 bg-slate-100 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex">
                                                        <div
                                                            className="h-full bg-emerald-500 rounded-l-md"
                                                            style={{ width: `${Math.max((d.auto / maxWeekProd) * 100, 0)}%` }}
                                                        />
                                                        <div
                                                            className="h-full bg-amber-400"
                                                            style={{ width: `${Math.max(((d.prod - d.auto) / maxWeekProd) * 100, 0)}%` }}
                                                        />
                                                    </div>
                                                </Tooltip>
                                                <Tooltip
                                                    className="flex-1"
                                                    content={
                                                        <div className="text-center">
                                                            <div className="font-semibold">{prev.day} (sem. précédente)</div>
                                                            <div>Production: {prev.prod.toFixed(2)} kWh</div>
                                                        </div>
                                                    }
                                                >
                                                    <div className="h-6 bg-slate-100 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                                        <div
                                                            className="h-full bg-slate-400 rounded-md"
                                                            style={{ width: `${Math.max((prev.prod / maxWeekProd) * 100, 0)}%` }}
                                                        />
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <span className="w-28 text-xs text-right">
                                                <span className="text-amber-600">{d.prod.toFixed(1)}</span>
                                                <span className="text-gray-400 mx-1">/</span>
                                                <span className="text-gray-500">{prev.prod.toFixed(1)}</span>
                                                <span className="text-gray-400 ml-0.5">kWh</span>
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
                                        <span className="w-3 h-3 rounded bg-emerald-500" /> Autoconsommé
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 rounded bg-amber-400" /> Exporté réseau
                                    </span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded bg-slate-400" /> Sem. précédente
                                </span>
                            </div>
                        </>
                    )}
                </Section>
            </div>
        </>
    );
}

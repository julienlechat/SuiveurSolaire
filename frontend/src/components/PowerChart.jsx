import { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const COLORS = [
    { border: "#3b82f6", bg: "rgba(59, 130, 246, 0.08)" },   // Bleu
    { border: "#ef4444", bg: "rgba(239, 68, 68, 0.08)" },     // Rouge
    { border: "#22c55e", bg: "rgba(34, 197, 94, 0.08)" },     // Vert
    { border: "#a855f7", bg: "rgba(168, 85, 247, 0.08)" },   // Violet
];

export default function PowerChart({ measurements, loading }) {
    const chartData = useMemo(() => {
        if (!measurements || measurements.length === 0) {
            return null;
        }

        // Grouper par intervalle de 15 minutes et par point
        const INTERVAL_MINUTES = 15;
        const pointsMap = new Map();
        const timeSlots = new Map();

        // Générer tous les slots de la journée (00:00 à 23:45)
        const labels = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += INTERVAL_MINUTES) {
                const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
                labels.push(label);
                timeSlots.set(label, new Map());
            }
        }

        // Remplir les données
        measurements.forEach((m) => {
            const date = new Date(m.ts);
            const h = date.getHours();
            const minutes = Math.floor(date.getMinutes() / INTERVAL_MINUTES) * INTERVAL_MINUTES;
            const slotKey = `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
            
            if (!pointsMap.has(m.point_name)) {
                pointsMap.set(m.point_name, m.point_id);
            }

            const slot = timeSlots.get(slotKey);
            if (slot) {
                if (!slot.has(m.point_name)) {
                    slot.set(m.point_name, []);
                }
                slot.get(m.point_name).push(parseFloat(m.power_w) || 0);
            }
        });

        // Créer les datasets
        const pointNames = Array.from(pointsMap.keys());
        const datasets = pointNames.map((name, index) => {
            const color = COLORS[index % COLORS.length];
            const data = labels.map((label) => {
                const slot = timeSlots.get(label);
                const values = slot?.get(name);
                if (!values || values.length === 0) return null;
                return values.reduce((a, b) => a + b, 0) / values.length;
            });

            return {
                label: name,
                data,
                borderColor: color.border,
                backgroundColor: color.bg,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
                borderWidth: 2,
            };
        });

        return { labels, datasets };
    }, [measurements]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="h-64 bg-slate-100 rounded"></div>
            </div>
        );
    }

    if (!chartData) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="font-semibold text-gray-900">Évolution sur 24h</span>
                </div>
                <div className="h-64 flex items-center justify-center text-gray-400">
                    Aucune donnée disponible pour cette date
                </div>
            </div>
        );
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            legend: {
                position: "top",
                align: "end",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 15,
                    font: { size: 11 },
                    color: "#64748b",
                },
            },
            tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                padding: 12,
                titleFont: { size: 12, weight: "normal" },
                bodyFont: { size: 12 },
                borderColor: "rgba(255,255,255,0.1)",
                borderWidth: 1,
                callbacks: {
                    label: (context) => {
                        const value = context.parsed.y;
                        if (value === null) return null;
                        return `${context.dataset.label}: ${value.toFixed(0)} W`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    maxRotation: 0,
                    font: { size: 10 },
                    color: "#94a3b8",
                    autoSkip: false,
                    callback: function (value, index) {
                        const label = this.getLabelForValue(value);
                        if (label && label.endsWith(":00")) {
                            const hour = parseInt(label.split(":")[0], 10);
                            if (hour % 2 === 0) {
                                return `${String(hour).padStart(2, "0")}h`;
                            }
                        }
                        return "";
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: { color: "#f1f5f9" },
                ticks: {
                    font: { size: 10 },
                    color: "#94a3b8",
                    callback: (value) => {
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}kW`;
                        return `${value}W`;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-50">
                        <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l4-4 4 4 4-8 6 8" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21H3V3" />
                        </svg>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-900 text-sm">Évolution sur 24h</span>
                        <p className="text-[10px] text-gray-400">Puissance par point de mesure</p>
                    </div>
                </div>
                <span className="text-xs text-gray-400">
                    {measurements?.length || 0} mesures
                </span>
            </div>
            <div className="h-72">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}

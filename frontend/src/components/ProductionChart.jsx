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

const PRODUCER_COLOR  = { border: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" };  // amber
const CONSUMER_COLOR  = { border: "#64748b", bg: "rgba(100, 116, 139, 0.08)" }; // slate

export default function ProductionChart({ measurements, producerIds, loading }) {
    const chartData = useMemo(() => {
        if (!measurements || measurements.length === 0) return null;

        const INTERVAL_MINUTES = 15;
        const timeSlots = new Map();
        const labels = [];

        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += INTERVAL_MINUTES) {
                const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
                labels.push(label);
                timeSlots.set(label, { producers: [], consumers: [] });
            }
        }

        measurements.forEach((m) => {
            const date = new Date(m.ts);
            const h = date.getHours();
            const minutes = Math.floor(date.getMinutes() / INTERVAL_MINUTES) * INTERVAL_MINUTES;
            const slotKey = `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
            const slot = timeSlots.get(slotKey);
            if (!slot) return;

            const power = parseFloat(m.power_w) || 0;
            if (producerIds && producerIds.has(m.point_id)) {
                slot.producers.push(power);
            } else {
                // Pour les consommateurs, on ignore les exports (surplus vers réseau)
                if (!m.direction_export) {
                    slot.consumers.push(power);
                }
            }
        });

        const avgOrNull = (arr) => arr.length === 0 ? null : arr.reduce((a, b) => a + b, 0) / arr.length;

        const productionData = labels.map((label) => avgOrNull(timeSlots.get(label).producers));
        const consumptionData = labels.map((label) => avgOrNull(timeSlots.get(label).consumers));

        return {
            labels,
            datasets: [
                {
                    label: "Production",
                    data: productionData,
                    borderColor: PRODUCER_COLOR.border,
                    backgroundColor: PRODUCER_COLOR.bg,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    borderWidth: 2,
                    order: 1,
                },
                {
                    label: "Consommation réseau",
                    data: consumptionData,
                    borderColor: CONSUMER_COLOR.border,
                    backgroundColor: CONSUMER_COLOR.bg,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    borderWidth: 2,
                    order: 2,
                },
            ],
        };
    }, [measurements, producerIds]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5 h-full animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
                <div className="flex-1 min-h-[250px] bg-slate-100 rounded" />
            </div>
        );
    }

    if (!chartData) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-amber-50">
                        <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.36-.71.71M5.64 18.36l-.71.71m12.73 0-.71-.71M5.64 5.64l-.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">Production vs Consommation réseau</span>
                </div>
                <div className="flex-1 min-h-[250px] flex items-center justify-center text-gray-400 text-sm">
                    Aucune donnée disponible pour cette date
                </div>
            </div>
        );
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
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
                            if (hour % 2 === 0) return `${String(hour).padStart(2, "0")}h`;
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
                    callback: (value) => value >= 1000 ? `${(value / 1000).toFixed(1)}kW` : `${value}W`,
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-50">
                        <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.36-.71.71M5.64 18.36l-.71.71m12.73 0-.71-.71M5.64 5.64l-.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />
                        </svg>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-900 text-sm">Production vs Consommation réseau</span>
                        <p className="text-[10px] text-gray-400">Puissance instantanée sur 24h (moyennes 15 min)</p>
                    </div>
                </div>
                <span className="text-xs text-gray-400">
                    {measurements?.length || 0} mesures
                </span>
            </div>
            <div className="flex-1 min-h-[250px]">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}

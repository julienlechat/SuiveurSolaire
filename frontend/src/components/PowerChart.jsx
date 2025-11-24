import { useEffect, useRef } from "react";
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

// Enregistrer les composants Chart.js
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

/**
 * Graphique d'évolution de la puissance au fil du temps
 * Affiche 4 courbes (une par point de mesure)
 */
export default function PowerChart({ measurements = [], colorPalette = [] }) {
    // Grouper les mesures par point de mesure
    const pointsData = {};

    measurements.forEach((m) => {
        if (!pointsData[m.point_id]) {
            pointsData[m.point_id] = {
                name: m.point_name,
                data: [],
                timestamps: [],
            };
        }
        pointsData[m.point_id].data.push(m.power_w || 0);
        pointsData[m.point_id].timestamps.push(new Date(m.ts));
    });

    // Obtenir tous les timestamps uniques et triés
    const allTimestamps = [...new Set(measurements.map((m) => m.ts))].sort();

    // Formater les labels (heures)
    const labels = allTimestamps.map((ts) => {
        const date = new Date(ts);
        return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    });

    // Créer les datasets pour Chart.js
    const datasets = Object.entries(pointsData).map(
        ([pointId, pointData], index) => {
            const color =
                colorPalette[index] || `hsl(${index * 90}, 70%, 50%)`;

            // Créer un array avec toutes les valeurs pour chaque timestamp
            const data = allTimestamps.map((ts) => {
                const idx = pointData.timestamps.findIndex(
                    (t) => t.toISOString() === ts
                );
                return idx >= 0 ? pointData.data[idx] : null;
            });

            return {
                label: pointData.name,
                data: data,
                borderColor: color,
                backgroundColor: color + "20",
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                tension: 0.4,
                fill: false,
            };
        }
    );

    const data = {
        labels,
        datasets,
    };

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
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                            label += ": ";
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toFixed(0) + " W";
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 12,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                },
                ticks: {
                    callback: function (value) {
                        return value + " W";
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-full">
            {measurements.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-12 h-12 mx-auto mb-2 text-gray-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                            />
                        </svg>
                        <p className="text-sm">
                            Aucune donnée disponible pour cette période
                        </p>
                    </div>
                </div>
            ) : (
                <Line data={data} options={options} />
            )}
        </div>
    );
}


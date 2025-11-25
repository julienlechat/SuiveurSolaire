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
 * Affiche toujours 24h (0h-23h) pour repérage facile
 */
export default function PowerChart({ measurements = [], colorPalette = [] }) {
    // Créer les 24 heures de la journée (0h à 23h)
    const hours24 = Array.from({ length: 24 }, (_, i) => i);
    const labels = hours24.map(h => `${String(h).padStart(2, '0')}:00`);

    // Grouper les mesures par point de mesure et par heure
    const pointsData = {};

    measurements.forEach((m) => {
        if (!pointsData[m.point_id]) {
            pointsData[m.point_id] = {
                name: m.point_name,
                dataByHour: {}, // { hour: [values] }
            };
        }
        
        const date = new Date(m.ts);
        const hour = date.getHours();
        
        if (!pointsData[m.point_id].dataByHour[hour]) {
            pointsData[m.point_id].dataByHour[hour] = [];
        }
        
        pointsData[m.point_id].dataByHour[hour].push(m.power_w || 0);
    });

    // Palette de couleurs avec gradients
    const gradientColors = [
        { border: "#8b5cf6", bg1: "#8b5cf680", bg2: "#8b5cf610" }, // Violet
        { border: "#ec4899", bg1: "#ec489980", bg2: "#ec489910" }, // Rose
        { border: "#f59e0b", bg1: "#f59e0b80", bg2: "#f59e0b10" }, // Orange
        { border: "#10b981", bg1: "#10b98180", bg2: "#10b98110" }, // Vert
        { border: "#3b82f6", bg1: "#3b82f680", bg2: "#3b82f610" }, // Bleu
        { border: "#ef4444", bg1: "#ef444480", bg2: "#ef444410" }, // Rouge
    ];

    // Créer les datasets pour Chart.js
    const datasets = Object.entries(pointsData).map(
        ([pointId, pointData], index) => {
            const colorScheme = gradientColors[index] || gradientColors[0];

            // Pour chaque heure (0-23), calculer la moyenne des valeurs disponibles
            const data = hours24.map((hour) => {
                const valuesForHour = pointData.dataByHour[hour];
                if (!valuesForHour || valuesForHour.length === 0) {
                    return null; // Pas de données pour cette heure
                }
                // Moyenne des valeurs de cette heure
                const avg = valuesForHour.reduce((sum, v) => sum + v, 0) / valuesForHour.length;
                return avg;
            });

            return {
                label: pointData.name,
                data: data,
                borderColor: colorScheme.border,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return colorScheme.bg1;
                    
                    // Créer un gradient vertical
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, colorScheme.bg2);
                    gradient.addColorStop(1, colorScheme.bg1);
                    return gradient;
                },
                borderWidth: 3,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBorderWidth: 2,
                pointHoverBackgroundColor: "#fff",
                tension: 0.4,
                fill: true,
                spanGaps: true, // Connecter les points même avec des null entre deux
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
                        size: 13,
                        weight: "500",
                    },
                    boxWidth: 12,
                    boxHeight: 12,
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 13,
                    weight: "600",
                },
                bodyFont: {
                    size: 12,
                },
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
                    autoSkip: false, // Afficher toutes les heures
                    maxTicksLimit: 24, // 24 heures
                    font: {
                        size: 11,
                    },
                    color: "#6b7280",
                    callback: function(value, index) {
                        // Afficher seulement les heures paires pour éviter la surcharge
                        return index % 2 === 0 ? this.getLabelForValue(value) : '';
                    }
                },
                border: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: "#6b7280",
                    padding: 8,
                    callback: function (value) {
                        return value + " W";
                    },
                },
                border: {
                    display: false,
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


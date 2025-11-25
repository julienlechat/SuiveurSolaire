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
 * Graphique d'évolution de la puissance sur 24h
 * Granularité de 10 minutes (144 points)
 * Design élégant avec courbes lisses et gradients
 */
export default function PowerChart({ measurements = [], colorPalette = [] }) {
    // Intervalle en minutes (10 min = 144 points sur 24h)
    const INTERVAL_MINUTES = 10;
    const SLOTS_PER_DAY = (24 * 60) / INTERVAL_MINUTES; // 144

    // Créer les slots de 10 minutes pour la journée
    const timeSlots = Array.from({ length: SLOTS_PER_DAY }, (_, i) => i);
    
    // Labels : afficher uniquement les heures pleines pour la lisibilité
    const labels = timeSlots.map(slot => {
        const totalMinutes = slot * INTERVAL_MINUTES;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        // Afficher seulement les heures pleines comme label visible
        if (minutes === 0) {
            return `${String(hours).padStart(2, '0')}h`;
        }
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    });

    // Grouper les mesures par point de mesure et par slot de 10 minutes
    const pointsData = {};

    measurements.forEach((m) => {
        if (!m.point_id || m.power_w === null || m.power_w === undefined) return;

        if (!pointsData[m.point_id]) {
            pointsData[m.point_id] = {
                name: m.point_name || `Point ${m.point_id}`,
                dataBySlot: {},
            };
        }
        
        // Parser le timestamp et calculer le slot
        let slot;
        try {
            const date = new Date(m.ts);
            if (isNaN(date.getTime())) {
                return;
            }
            const totalMinutes = date.getHours() * 60 + date.getMinutes();
            slot = Math.floor(totalMinutes / INTERVAL_MINUTES);
        } catch (e) {
            return;
        }
        
        if (!pointsData[m.point_id].dataBySlot[slot]) {
            pointsData[m.point_id].dataBySlot[slot] = [];
        }
        
        pointsData[m.point_id].dataBySlot[slot].push(parseFloat(m.power_w) || 0);
    });

    // Palette de couleurs
    const defaultColors = [
        "#3b82f6", // Bleu
        "#ef4444", // Rouge
        "#f59e0b", // Orange
        "#10b981", // Vert
        "#8b5cf6", // Violet
        "#ec4899", // Rose
    ];

    const colors = colorPalette.length > 0 ? colorPalette : defaultColors;

    // Créer les datasets pour Chart.js
    const datasets = Object.entries(pointsData).map(
        ([pointId, pointData], index) => {
            const color = colors[index % colors.length];

            // Pour chaque slot, calculer la moyenne des valeurs disponibles
            const data = timeSlots.map((slot) => {
                const valuesForSlot = pointData.dataBySlot[slot];
                if (!valuesForSlot || valuesForSlot.length === 0) {
                    return null;
                }
                const avg = valuesForSlot.reduce((sum, v) => sum + v, 0) / valuesForSlot.length;
                return Math.round(avg * 10) / 10; // Arrondir à 1 décimale
            });

            return {
                label: pointData.name,
                data: data,
                borderColor: color,
                backgroundColor: `${color}15`,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 2,
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: color,
                tension: 0.3, // Un peu moins de tension pour plus de fidélité
                fill: true,
                spanGaps: true,
            };
        }
    );

    const chartData = {
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
                align: "end",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 20,
                    font: {
                        size: 12,
                        weight: "500",
                    },
                    boxWidth: 8,
                    boxHeight: 8,
                },
            },
            tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 13,
                    weight: "600",
                },
                bodyFont: {
                    size: 12,
                },
                bodySpacing: 6,
                callbacks: {
                    title: function(context) {
                        // Afficher l'heure complète (HH:MM)
                        const label = context[0].label;
                        if (label.endsWith('h')) {
                            return label.replace('h', ':00');
                        }
                        return label;
                    },
                    label: function (context) {
                        const label = context.dataset.label || "";
                        if (context.parsed.y !== null) {
                            const value = context.parsed.y;
                            if (value >= 1000) {
                                return `${label}: ${(value / 1000).toFixed(2)} kW`;
                            }
                            return `${label}: ${value.toFixed(0)} W`;
                        }
                        return `${label}: —`;
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
                    font: {
                        size: 11,
                    },
                    color: "#94a3b8",
                    autoSkip: false,
                    callback: function(value, index) {
                        // Afficher seulement les heures pleines (toutes les 6 slots = 1h)
                        // Et seulement toutes les 2h pour éviter l'encombrement
                        if (index % 12 === 0) { // 12 slots = 2 heures
                            const label = this.getLabelForValue(value);
                            // Retourner seulement si c'est une heure pleine (format XXh)
                            if (label && label.endsWith('h')) {
                                return label;
                            }
                        }
                        return '';
                    }
                },
                border: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(148, 163, 184, 0.1)",
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: "#94a3b8",
                    padding: 10,
                    callback: function (value) {
                        if (value >= 1000) {
                            return (value / 1000).toFixed(1) + " kW";
                        }
                        return value + " W";
                    },
                },
                border: {
                    display: false,
                },
            },
        },
    };

    // Afficher un message si aucune donnée
    if (measurements.length === 0 || datasets.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                        </svg>
                    </div>
                    <p className="text-slate-500 text-sm">Aucune donnée pour cette période</p>
                    <p className="text-slate-400 text-xs mt-1">Les mesures apparaîtront ici</p>
                </div>
            </div>
        );
    }

    return <Line data={chartData} options={options} />;
}

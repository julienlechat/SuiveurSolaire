import { useEffect, useRef } from 'react';

/**
 * Composant jauge circulaire pour afficher la puissance en temps réel
 * Similaire au design de l'ancien dashboard Ekonity
 */
export default function PowerGauge({ 
    value = 0, 
    max = 3000, 
    label = "Puissance", 
    unit = "W",
    color = "#3b82f6",
    direction = "import"
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculer l'angle basé sur la valeur (de -135° à 135° = 270° total)
        const percentage = Math.min(Math.abs(value) / max, 1);
        const startAngle = -Math.PI * 0.75; // -135°
        const endAngle = startAngle + (percentage * Math.PI * 1.5); // jusqu'à +135°

        // Fond de la jauge (arc gris)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, Math.PI * 0.75, false);
        ctx.lineWidth = 18;
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineCap = 'round';
        ctx.stroke();

        // Arc de progression (couleur)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
        ctx.lineWidth = 18;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Point indicateur au bout de l'arc
        const indicatorX = centerX + radius * Math.cos(endAngle);
        const indicatorY = centerY + radius * Math.sin(endAngle);
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

    }, [value, max, color]);

    // Formatage de la valeur
    const formattedValue = Math.abs(value).toFixed(2);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
                <canvas 
                    ref={canvasRef} 
                    width={192} 
                    height={192}
                    className="absolute inset-0"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold" style={{ color }}>
                        {formattedValue}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                        {unit}
                    </div>
                    {value !== 0 && (
                        <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                                direction === 'export' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {direction === 'export' ? '↑ Export' : '↓ Import'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-2 text-sm font-medium text-gray-700">
                {label}
            </div>
        </div>
    );
}


/**
 * Jauge horizontale pour afficher la puissance en temps réel
 * Design simple et clair avec barre de progression
 * Gère les deux sens: import (consommation) et export (production)
 */
export default function HorizontalGauge({
    value = 0,
    max = 3000,
    label = "Point",
    unit = "W",
    color = "#3b82f6",
    voltage = null,
    current = null,
    direction = "import", // "import" ou "export"
}) {
    // Calculer le pourcentage (0-100%)
    const percentage = Math.min((Math.abs(value) / max) * 100, 100);

    // Formater les valeurs
    const formatValue = (val, decimals = 1) => {
        if (val === null || val === undefined) return "—";
        return Number(val).toFixed(decimals);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
            {/* En-tête : Nom du point + Valeur */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                    ></div>
                    <h3 className="font-semibold text-gray-900">{label}</h3>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                        {formatValue(Math.abs(value), 0)}
                    </span>
                    <span className="text-sm text-gray-600">{unit}</span>
                </div>
            </div>

            {/* Barre de progression horizontale */}
            <div className="relative w-full h-6 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                    }}
                ></div>
                {/* Texte au centre de la barre */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                        {percentage.toFixed(0)}%
                    </span>
                </div>
            </div>

            {/* Détails : Tension, Courant, Direction */}
            <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-3">
                    {voltage !== null && (
                        <div className="flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3 h-3 text-blue-500"
                            >
                                <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
                            </svg>
                            <span>{formatValue(voltage, 1)} V</span>
                        </div>
                    )}
                    {current !== null && (
                        <div className="flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3 h-3 text-yellow-500"
                            >
                                <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                            </svg>
                            <span>{formatValue(current, 2)} A</span>
                        </div>
                    )}
                </div>
                {value !== 0 && (
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            direction === "export"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {direction === "export" ? "↑ Export" : "↓ Import"}
                    </span>
                )}
            </div>
        </div>
    );
}


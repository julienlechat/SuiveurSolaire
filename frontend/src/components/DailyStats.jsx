/**
 * Statistiques du jour pour un suiveur d'énergie
 * Focus : Consommation totale, Coût, Moyenne, Pic
 */
export default function DailyStats({ stats }) {
    const formatNumber = (value, decimals = 2) => {
        if (value === null || value === undefined) return "—";
        const n = Number(value);
        if (Number.isNaN(n)) return "—";
        return n.toFixed(decimals);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "—";
        const date = new Date(timestamp);
        return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Consommation totale */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-blue-600"
                    >
                        <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                        <path
                            fillRule="evenodd"
                            d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-xs font-medium text-blue-700 uppercase">
                        Consommation
                    </span>
                </div>
                <div className="text-3xl font-bold text-blue-900">
                    {formatNumber(stats?.totalConsumption || 0, 2)}
                    <span className="text-lg font-normal text-blue-700 ml-1">
                        kWh
                    </span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                    Total du jour
                </div>
            </div>

            {/* Coût estimé */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-purple-600"
                    >
                        <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                        <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-xs font-medium text-purple-700 uppercase">
                        Coût estimé
                    </span>
                </div>
                <div className="text-3xl font-bold text-purple-900">
                    {formatNumber(stats?.estimatedCost || 0, 2)}
                    <span className="text-lg font-normal text-purple-700 ml-1">
                        €
                    </span>
                </div>
                <div className="text-xs text-purple-600 mt-1">
                    À {formatNumber(stats?.pricePerKwh || 0.18, 3)} €/kWh
                </div>
            </div>

            {/* Puissance moyenne */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-green-600"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
                            clipRule="evenodd"
                        />
                        <path
                            fillRule="evenodd"
                            d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-xs font-medium text-green-700 uppercase">
                        Moyenne
                    </span>
                </div>
                <div className="text-3xl font-bold text-green-900">
                    {formatNumber(stats?.averagePower || 0, 0)}
                    <span className="text-lg font-normal text-green-700 ml-1">
                        W
                    </span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                    Puissance moyenne
                </div>
            </div>

            {/* Pic de puissance */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-orange-600"
                    >
                        <path
                            fillRule="evenodd"
                            d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-xs font-medium text-orange-700 uppercase">
                        Pic
                    </span>
                </div>
                <div className="text-3xl font-bold text-orange-900">
                    {formatNumber(stats?.maxPower || 0, 0)}
                    <span className="text-lg font-normal text-orange-700 ml-1">
                        W
                    </span>
                </div>
                <div className="text-xs text-orange-600 mt-1">
                    {stats?.maxPowerTime
                        ? `À ${formatTime(stats.maxPowerTime)}`
                        : "—"}
                </div>
            </div>
        </div>
    );
}


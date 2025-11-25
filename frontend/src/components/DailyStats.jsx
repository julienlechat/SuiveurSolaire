/**
 * Statistiques du jour pour un suiveur d'énergie
 * Style moderne avec icônes colorées
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

    const hasProduction = stats?.totalProduction > 0;

    // Composant Card réutilisable
    const StatCard = ({ icon, iconBg, iconColor, title, value, unit, subtitle, trend }) => (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
                            <div className={iconColor}>
                                {icon}
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{title}</span>
                    </div>
                    <div className="ml-0">
                        <div className="text-2xl font-bold text-gray-900">
                            {value}
                            <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
                        </div>
                        {subtitle && (
                            <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
                        )}
                        {trend && (
                            <div className={`text-xs mt-1 flex items-center gap-1 ${trend.positive ? 'text-green-600' : 'text-gray-500'}`}>
                                {trend.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${hasProduction ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4`}>
            {/* Consommation totale */}
            <StatCard
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v.258a33.186 33.186 0 0 1 6.668.83.75.75 0 0 1-.336 1.461 31.28 31.28 0 0 0-1.103-.232l1.702 7.545a.75.75 0 0 1-.387.832A4.981 4.981 0 0 1 15 13.75a4.982 4.982 0 0 1-1.294-.172.75.75 0 0 1-.387-.832l1.702-7.545a31.28 31.28 0 0 0-10.042 0l1.702 7.545a.75.75 0 0 1-.387.832A4.98 4.98 0 0 1 5 13.75a4.98 4.98 0 0 1-1.294-.172.75.75 0 0 1-.387-.832l1.702-7.545a31.28 31.28 0 0 0-1.103.232.75.75 0 0 1-.336-1.462 33.186 33.186 0 0 1 6.668-.829V2.75A.75.75 0 0 1 10 2ZM5 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 5 15Zm5 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15Zm5 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 15 15Z" clipRule="evenodd" />
                    </svg>
                }
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                title="Consommation"
                value={formatNumber(stats?.totalConsumption || 0, 2)}
                unit="kWh"
                subtitle="Total importé"
            />

            {/* Coût estimé */}
            <StatCard
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 0 0-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152Z" />
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-6a.75.75 0 0 1 .75.75v.316a3.78 3.78 0 0 1 1.653.713c.426.33.744.74.925 1.2a.75.75 0 0 1-1.395.55 1.35 1.35 0 0 0-.447-.563 2.187 2.187 0 0 0-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 1 1-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 1 1 1.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 0 1-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 0 1 1.653-.713V4.75A.75.75 0 0 1 10 4Z" clipRule="evenodd" />
                    </svg>
                }
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
                title="Coût"
                value={formatNumber(stats?.estimatedCost || 0, 2)}
                unit="€"
                subtitle={`À ${formatNumber(stats?.pricePerKwh || 0.18, 3)} €/kWh`}
            />

            {/* Puissance moyenne */}
            <StatCard
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v7.5h7.5a.75.75 0 0 1 0 1.5h-7.5v7.5a.75.75 0 0 1-1.5 0v-7.5h-7.5a.75.75 0 0 1 0-1.5h7.5v-7.5A.75.75 0 0 1 10 2Z" clipRule="evenodd" />
                    </svg>
                }
                iconBg="bg-green-100"
                iconColor="text-green-600"
                title="Moyenne"
                value={formatNumber(stats?.averagePower || 0, 0)}
                unit="W"
                subtitle="Puissance moyenne"
            />

            {/* Production (si applicable) */}
            {hasProduction && (
                <StatCard
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" />
                        </svg>
                    }
                    iconBg="bg-yellow-100"
                    iconColor="text-yellow-600"
                    title="Production"
                    value={formatNumber(stats?.totalProduction || 0, 2)}
                    unit="kWh"
                    subtitle={`Revenu: ${formatNumber(stats?.estimatedRevenue || 0, 2)} €`}
                />
            )}

            {/* Pic de puissance */}
            <StatCard
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                    </svg>
                }
                iconBg="bg-orange-100"
                iconColor="text-orange-600"
                title="Pic"
                value={formatNumber(stats?.maxPower || 0, 0)}
                unit="W"
                subtitle={stats?.maxPowerTime ? `À ${formatTime(stats.maxPowerTime)}` : "—"}
            />
        </div>
    );
}


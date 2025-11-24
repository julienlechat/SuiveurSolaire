/**
 * Carte de statistiques pour afficher les données du jour
 */
export default function StatsCard({ title, value, unit, icon, color = 'blue', badge = null, trend = null }) {
    const colorClasses = {
        blue: 'border-l-blue-500 bg-blue-50',
        yellow: 'border-l-yellow-500 bg-yellow-50',
        purple: 'border-l-purple-500 bg-purple-50',
        green: 'border-l-green-500 bg-green-50',
        red: 'border-l-red-500 bg-red-50',
    };

    const iconColorClasses = {
        blue: 'text-blue-600',
        yellow: 'text-yellow-600',
        purple: 'text-purple-600',
        green: 'text-green-600',
        red: 'text-red-600',
    };

    const badgeColorClasses = {
        blue: 'bg-blue-100 text-blue-700',
        yellow: 'bg-yellow-100 text-yellow-700',
        purple: 'bg-purple-100 text-purple-700',
        green: 'bg-green-100 text-green-700',
        red: 'bg-red-100 text-red-700',
    };

    return (
        <div className={`border-l-4 ${colorClasses[color]} p-4 rounded-lg shadow-sm`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={`${iconColorClasses[color]}`}>
                        {icon}
                    </div>
                    <div>
                        <div className="text-xs text-gray-600 uppercase font-medium">
                            {title}
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                            {value} <span className="text-sm font-normal text-gray-600">{unit}</span>
                        </div>
                        {trend && (
                            <div className={`text-xs mt-1 ${
                                trend.direction === 'up' 
                                    ? trend.positive ? 'text-green-600' : 'text-red-600'
                                    : trend.positive ? 'text-red-600' : 'text-green-600'
                            }`}>
                                {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
                            </div>
                        )}
                    </div>
                </div>
                {badge && (
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${badgeColorClasses[badge.color || color]}`}>
                        {badge.text}
                    </span>
                )}
            </div>
        </div>
    );
}


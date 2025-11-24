import { useState, useEffect } from 'react';

/**
 * Composant tableau pour afficher l'historique des mesures
 */
export default function MeasurementTable({ measurements = [] }) {
    const [sortConfig, setSortConfig] = useState({ key: 'ts', direction: 'desc' });
    const [filter, setFilter] = useState('all');

    // Fonction de tri
    const sortedMeasurements = [...measurements].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // Filtrage par point de mesure
    const filteredMeasurements = filter === 'all' 
        ? sortedMeasurements 
        : sortedMeasurements.filter(m => m.point_name === filter);

    // Obtenir la liste unique des points de mesure
    const uniquePoints = [...new Set(measurements.map(m => m.point_name))];

    // Fonction pour changer le tri
    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
        });
    };

    // Fonction pour formater les nombres
    const formatNumber = (value, digits = 2) => {
        if (value === null || value === undefined) return "—";
        const n = Number(value);
        if (Number.isNaN(n)) return "—";
        return n.toFixed(digits);
    };

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Icône de tri
    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return sortConfig.direction === 'asc' ? (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    return (
        <div className="w-full">
            {/* En-tête avec filtres */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Filtrer par point :</span>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tous les points</option>
                        {uniquePoints.map(point => (
                            <option key={point} value={point}>{point}</option>
                        ))}
                    </select>
                </div>
                <div className="text-sm text-gray-600">
                    {filteredMeasurements.length} mesure{filteredMeasurements.length > 1 ? 's' : ''}
                </div>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th 
                                onClick={() => handleSort('ts')}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center gap-2">
                                    Timestamp
                                    <SortIcon columnKey="ts" />
                                </div>
                            </th>
                            <th 
                                onClick={() => handleSort('point_name')}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center gap-2">
                                    Point
                                    <SortIcon columnKey="point_name" />
                                </div>
                            </th>
                            <th 
                                onClick={() => handleSort('power_w')}
                                className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Puissance (W)
                                    <SortIcon columnKey="power_w" />
                                </div>
                            </th>
                            <th 
                                onClick={() => handleSort('voltage_v')}
                                className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Tension (V)
                                    <SortIcon columnKey="voltage_v" />
                                </div>
                            </th>
                            <th 
                                onClick={() => handleSort('current_a')}
                                className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Courant (A)
                                    <SortIcon columnKey="current_a" />
                                </div>
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Direction
                            </th>
                            <th 
                                onClick={() => handleSort('import_kwh_total')}
                                className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Import (kWh)
                                    <SortIcon columnKey="import_kwh_total" />
                                </div>
                            </th>
                            <th 
                                onClick={() => handleSort('export_kwh_total')}
                                className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Export (kWh)
                                    <SortIcon columnKey="export_kwh_total" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMeasurements.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                    Aucune mesure disponible
                                </td>
                            </tr>
                        ) : (
                            filteredMeasurements.map((measurement) => (
                                <tr 
                                    key={measurement.id} 
                                    className="hover:bg-blue-50 transition-colors"
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(measurement.ts)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-900">
                                                {measurement.point_name}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500">
                                                (M{measurement.module}C{measurement.channel})
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right">
                                        <span className={`text-sm font-semibold ${
                                            measurement.power_w > 0 
                                                ? 'text-orange-600' 
                                                : 'text-gray-600'
                                        }`}>
                                            {formatNumber(measurement.power_w, 1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                                        {formatNumber(measurement.voltage_v, 1)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                                        {formatNumber(measurement.current_a, 2)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            measurement.direction_export
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {measurement.direction_export ? '↑ Export' : '↓ Import'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                                        {formatNumber(measurement.import_kwh_total, 3)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                                        {formatNumber(measurement.export_kwh_total, 3)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


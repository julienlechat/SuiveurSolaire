import { useState } from "react";

// Header spécifique pour les réglages (sans date picker)
function SettingsHeader() {
    return (
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 py-4 md:py-5">
            <div className="flex items-center">
                <div className="p-2 rounded-lg bg-slate-100 mr-3">
                    <svg 
                        className="h-5 w-5 text-slate-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Réglages</h2>
                    <p className="text-sm text-gray-500">Configuration de votre installation</p>
                </div>
            </div>
        </header>
    );
}

// Section de carte réutilisable
function SettingsSection({ title, description, children }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const [refreshInterval, setRefreshInterval] = useState(5);

    return (
        <>
            <SettingsHeader />
            
            <div className="p-6 space-y-6">
                {/* Points de mesure */}
                <SettingsSection 
                    title="Points de mesure" 
                    description="Configurez vos points de mesure et leurs paramètres"
                >
                    <div className="space-y-4">
                        {[
                            { id: 1, name: "Maison", module: 1, channel: 1, color: "blue" },
                            { id: 2, name: "Panneau Solaire", module: 1, channel: 2, color: "rose" },
                            { id: 3, name: "PV", module: 2, channel: 1, color: "emerald" },
                            { id: 4, name: "Spare", module: 2, channel: 2, color: "purple" },
                        ].map((point) => (
                            <div 
                                key={point.id}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg bg-${point.color}-100 text-${point.color}-600 flex items-center justify-center font-bold text-sm`}>
                                        {point.id}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{point.name}</p>
                                        <p className="text-xs text-gray-500">Module {point.module} • Channel {point.channel}</p>
                                    </div>
                                </div>
                                <button className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                                    Modifier
                                </button>
                            </div>
                        ))}
                    </div>
                </SettingsSection>

                {/* Contrat électrique */}
                <SettingsSection 
                    title="Contrat électrique" 
                    description="Informations sur votre contrat et tarification"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Type de contrat</p>
                            <p className="font-semibold text-gray-900">Tempo EDF</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Puissance souscrite</p>
                            <p className="font-semibold text-gray-900">9 kVA</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Heures creuses</p>
                            <p className="font-semibold text-gray-900">22h00 - 06h00</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Prix moyen kWh</p>
                            <p className="font-semibold text-gray-900">0.18 €</p>
                        </div>
                    </div>
                </SettingsSection>

                {/* Paramètres d'affichage */}
                <SettingsSection 
                    title="Affichage" 
                    description="Personnalisez l'affichage du tableau de bord"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Intervalle de rafraîchissement</p>
                                <p className="text-sm text-gray-500">Fréquence de mise à jour des données</p>
                            </div>
                            <select 
                                value={refreshInterval}
                                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value={1}>1 seconde</option>
                                <option value={5}>5 secondes</option>
                                <option value={10}>10 secondes</option>
                                <option value={30}>30 secondes</option>
                                <option value={60}>1 minute</option>
                            </select>
                        </div>
                    </div>
                </SettingsSection>

                {/* À propos */}
                <SettingsSection 
                    title="À propos" 
                    description="Informations sur l'application"
                >
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">SuiveurEnergie</p>
                            <p className="text-sm text-gray-500">Version 1.0.0</p>
                        </div>
                        <a 
                            href="https://github.com/julienlechat/SuiveurSolaire" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                        </a>
                    </div>
                </SettingsSection>
            </div>
        </>
    );
}


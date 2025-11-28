import { useState } from "react";

// Header spécifique pour les réglages
function SettingsHeader() {
    return (
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 py-4 md:py-5">
            <div className="flex items-center">
                <div className="p-2 rounded-lg bg-slate-100 mr-3">
                    <svg className="h-5 w-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

// Section card avec SVG obligatoire
function SettingsSection({ icon, title, description, children }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">{icon}</div>
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                    {description && <p className="text-xs text-gray-500">{description}</p>}
                </div>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

export default function SettingsPage() {
    const [refreshInterval, setRefreshInterval] = useState(5);

    return (
        <>
            <SettingsHeader />
            
            <div className="p-6 space-y-5">
                {/* Points de mesure */}
                <SettingsSection 
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    title="Points de mesure" 
                    description="Configurez vos points de mesure"
                >
                    <div className="space-y-3">
                        {[
                            { id: 1, name: "Maison", module: 1, channel: 1, bg: "bg-blue-100", text: "text-blue-600" },
                            { id: 2, name: "Panneau Solaire", module: 1, channel: 2, bg: "bg-rose-100", text: "text-rose-600" },
                            { id: 3, name: "PV", module: 2, channel: 1, bg: "bg-emerald-100", text: "text-emerald-600" },
                            { id: 4, name: "Spare", module: 2, channel: 2, bg: "bg-purple-100", text: "text-purple-600" },
                        ].map((point) => (
                            <div 
                                key={point.id}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-7 h-7 rounded-lg ${point.bg} ${point.text} flex items-center justify-center font-bold text-xs`}>
                                        {point.id}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{point.name}</p>
                                        <p className="text-xs text-gray-500">M{point.module} Ch.{point.channel}</p>
                                    </div>
                                </div>
                                <button className="text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                                    Modifier
                                </button>
                            </div>
                        ))}
                    </div>
                </SettingsSection>

                {/* Contrat électrique */}
                <SettingsSection 
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    title="Contrat électrique" 
                    description="Informations sur votre contrat"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-[10px] text-gray-500 uppercase font-medium mb-0.5">Type de contrat</p>
                            <p className="font-semibold text-gray-900 text-sm">Tempo EDF</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-[10px] text-gray-500 uppercase font-medium mb-0.5">Puissance souscrite</p>
                            <p className="font-semibold text-gray-900 text-sm">9 kVA</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-[10px] text-gray-500 uppercase font-medium mb-0.5">Heures creuses</p>
                            <p className="font-semibold text-gray-900 text-sm">22h - 06h</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-[10px] text-gray-500 uppercase font-medium mb-0.5">Prix moyen kWh</p>
                            <p className="font-semibold text-gray-900 text-sm">0.18 €</p>
                        </div>
                    </div>
                </SettingsSection>

                {/* Paramètres d'affichage */}
                <SettingsSection 
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                    title="Affichage" 
                    description="Personnalisez l'interface"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900 text-sm">Intervalle de rafraîchissement</p>
                            <p className="text-xs text-gray-500">Fréquence de mise à jour</p>
                        </div>
                        <select 
                            value={refreshInterval}
                            onChange={(e) => setRefreshInterval(Number(e.target.value))}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value={1}>1 seconde</option>
                            <option value={5}>5 secondes</option>
                            <option value={10}>10 secondes</option>
                            <option value={30}>30 secondes</option>
                            <option value={60}>1 minute</option>
                        </select>
                    </div>
                </SettingsSection>

                {/* À propos */}
                <SettingsSection 
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    title="À propos" 
                    description="Informations sur l'application"
                >
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="font-medium text-gray-900 text-sm">SuiveurEnergie</p>
                        <p className="text-xs text-gray-500">Version 1.0.0</p>
                    </div>
                </SettingsSection>
            </div>
        </>
    );
}

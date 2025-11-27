import { useState } from "react";

// Icônes SVG
const icons = {
    dashboard: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    ),
    chart: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    settings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    history: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    bolt: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    menu: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    ),
    close: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
};

const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: icons.dashboard },
    { id: "history", label: "Historique", icon: icons.history },
    { id: "analytics", label: "Analytique", icon: icons.chart },
    { id: "settings", label: "Paramètres", icon: icons.settings },
];

export default function Sidebar({ currentPage = "dashboard", onNavigate }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavigate = (pageId) => {
        onNavigate?.(pageId);
        setMobileMenuOpen(false);
    };

    // Logo avec éclair
    const Logo = ({ showText = true }) => (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            {showText && (
                <span className="font-semibold text-slate-800 text-lg tracking-tight">
                    SuiveurEnergie
                </span>
            )}
        </div>
    );

    // Item de menu
    const MenuItem = ({ item, collapsed = false }) => {
        const isActive = currentPage === item.id;
        return (
            <button
                onClick={() => handleNavigate(item.id)}
                className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${collapsed ? "justify-center" : ""}
                    ${isActive 
                        ? "bg-amber-50 text-amber-700 font-medium" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    }
                `}
                title={collapsed ? item.label : undefined}
            >
                <span className={isActive ? "text-amber-600" : "text-slate-400"}>
                    {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
            </button>
        );
    };

    return (
        <>
            {/* ====== SIDEBAR DESKTOP (lg+) ====== */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
                {/* Logo */}
                <div className="p-5 border-b border-slate-100">
                    <Logo />
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => (
                        <MenuItem key={item.id} item={item} />
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 text-center">
                        v0.0.19
                    </p>
                </div>
            </aside>

            {/* ====== SIDEBAR TABLETTE (md) ====== */}
            <aside className="hidden md:flex lg:hidden flex-col w-16 bg-white border-r border-slate-200 h-screen sticky top-0">
                {/* Logo icône seul */}
                <div className="p-3 border-b border-slate-100 flex justify-center">
                    <Logo showText={false} />
                </div>

                {/* Navigation icônes */}
                <nav className="flex-1 p-2 space-y-1">
                    {menuItems.map((item) => (
                        <MenuItem key={item.id} item={item} collapsed />
                    ))}
                </nav>
            </aside>

            {/* ====== NAVBAR MOBILE (sm) ====== */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <Logo />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        {mobileMenuOpen ? icons.close : icons.menu}
                    </button>
                </div>

                {/* Menu déroulant mobile */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
                        <nav className="p-3 space-y-1">
                            {menuItems.map((item) => (
                                <MenuItem key={item.id} item={item} />
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Overlay pour fermer le menu mobile */}
            {mobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/20 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
}


import { useState } from "react";

const menuItems = [
    { 
        id: "dashboard", 
        label: "Tableau de bord", 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
        )
    },
    { 
        id: "settings", 
        label: "Réglages", 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        )
    },
];

// Icônes menu/close pour mobile
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export default function Sidebar({ currentPage = "dashboard", onNavigate }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavigate = (pageId) => {
        onNavigate?.(pageId);
        setMobileMenuOpen(false);
    };

    // Logo
    const Logo = ({ collapsed = false }) => (
        <div className="flex items-center gap-2">
            <span className="text-amber-400 text-xl">✦</span>
            {!collapsed && (
                <span className="text-white font-semibold tracking-tight">
                    SuiveurEnergie
                </span>
            )}
        </div>
    );

    // Item de menu - Style original
    const MenuItem = ({ item, collapsed = false }) => {
        const isActive = currentPage === item.id;
        
        if (isActive) {
            return (
                <button
                    onClick={() => handleNavigate(item.id)}
                    className={`
                        flex items-center w-full space-x-3 p-3 bg-white rounded-xl 
                        text-neutral-800 cursor-pointer
                        ${collapsed ? "justify-center" : ""}
                    `}
                    title={collapsed ? item.label : undefined}
                >
                    {item.icon}
                    {!collapsed && <span className="text-xs font-medium">{item.label}</span>}
                </button>
            );
        }

        return (
            <button
                onClick={() => handleNavigate(item.id)}
                className={`
                    flex items-center w-full space-x-3 p-3 rounded-xl 
                    text-neutral-300 font-medium 
                    hover:text-white hover:font-bold hover:cursor-pointer
                    transition-colors
                    ${collapsed ? "justify-center" : ""}
                `}
                title={collapsed ? item.label : undefined}
            >
                {item.icon}
                {!collapsed && <span className="text-xs">{item.label}</span>}
            </button>
        );
    };

    return (
        <>
            {/* ====== SIDEBAR DESKTOP (lg+) ====== */}
            <aside className="hidden lg:flex flex-col w-56 bg-slate-900 min-h-screen">
                {/* Logo */}
                <div className="p-5">
                    <Logo />
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 flex-1 mt-4 px-5">
                    {menuItems.map((item) => (
                        <MenuItem key={item.id} item={item} />
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-5">
                    <p className="text-xs text-slate-500">
                        v0.0.20
                    </p>
                </div>
            </aside>

            {/* ====== SIDEBAR TABLETTE (md) ====== */}
            <aside className="hidden md:flex lg:hidden flex-col w-16 bg-slate-900 min-h-screen items-center">
                {/* Logo icône seul */}
                <div className="p-4">
                    <Logo collapsed />
                </div>

                {/* Navigation icônes */}
                <nav className="flex flex-col gap-1 flex-1 mt-4 px-2">
                    {menuItems.map((item) => (
                        <MenuItem key={item.id} item={item} collapsed />
                    ))}
                </nav>
            </aside>

            {/* ====== NAVBAR MOBILE (sm) ====== */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700">
                <div className="flex items-center justify-between px-4 py-3">
                    <Logo />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>

                {/* Menu déroulant mobile */}
                {mobileMenuOpen && (
                    <nav className="px-4 pb-4 space-y-1">
                        {menuItems.map((item) => (
                            <MenuItem key={item.id} item={item} />
                        ))}
                    </nav>
                )}
            </header>

            {/* Overlay pour fermer le menu mobile */}
            {mobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    style={{ top: '60px' }}
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
}

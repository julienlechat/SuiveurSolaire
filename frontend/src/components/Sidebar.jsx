import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// SVG Soleil (logo)
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
    </svg>
);

// Icône Maison (Tableau de bord)
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </svg>
);

// Icône Réglages
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

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

const menuItems = [
    { path: "/", label: "Tableau de bord", icon: <HomeIcon /> },
    { path: "/settings", label: "Réglages", icon: <SettingsIcon /> },
];

export default function Sidebar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/" || location.pathname === "/dashboard";
        }
        return location.pathname === path;
    };

    // Logo complet
    const Logo = ({ collapsed = false }) => (
        <div className={`flex items-center gap-2 text-white ${collapsed ? "justify-center" : "justify-center"}`}>
            <span className="text-yellow-400">
                <SunIcon />
            </span>
            {!collapsed && (
                <span className="font-bold text-2xl">SuiveurEnergie</span>
            )}
        </div>
    );

    // Item de menu avec Link
    const MenuItem = ({ item, collapsed = false }) => {
        const active = isActive(item.path);
        
        return (
            <Link
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                    flex items-center w-full space-x-3 p-3 rounded-xl transition-colors
                    ${collapsed ? "justify-center" : ""}
                    ${active 
                        ? "bg-white text-neutral-800" 
                        : "text-neutral-300 font-medium hover:text-white hover:bg-neutral-700"
                    }
                `}
                title={collapsed ? item.label : undefined}
            >
                {item.icon}
                {!collapsed && (
                    <span className={`text-xs ${active ? "font-medium" : ""}`}>
                        {item.label}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <>
            {/* ====== SIDEBAR DESKTOP (lg+) ====== */}
            <aside className="hidden lg:flex flex-col h-screen py-6 w-72 flex-shrink-0 bg-neutral-800">
                {/* Logo */}
                <div className="mt-2">
                    <Logo />
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-4 flex-1 mt-12 px-5">
                    {menuItems.map((item) => (
                        <MenuItem key={item.path} item={item} />
                    ))}
                </nav>

                {/* Footer */}
                <div className="flex justify-between items-center mt-3 mx-8">
                    <span className="text-[9px] text-neutral-400">
                        SuiveurEnergie v.1.0.0
                    </span>
                </div>
            </aside>

            {/* ====== SIDEBAR TABLETTE (md) ====== */}
            <aside className="hidden md:flex lg:hidden flex-col h-screen py-6 w-16 flex-shrink-0 bg-neutral-800 items-center">
                {/* Logo icône seul */}
                <div className="mt-2">
                    <Logo collapsed />
                </div>

                {/* Navigation icônes */}
                <nav className="flex flex-col gap-4 flex-1 mt-12 px-2">
                    {menuItems.map((item) => (
                        <MenuItem key={item.path} item={item} collapsed />
                    ))}
                </nav>
            </aside>

            {/* ====== NAVBAR MOBILE (sm) ====== */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-neutral-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link to="/" className="flex items-center gap-2 text-white">
                        <span className="text-yellow-400">
                            <SunIcon />
                        </span>
                        <span className="font-bold text-lg">SuiveurEnergie</span>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                    >
                        {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>

                {/* Menu déroulant mobile */}
                {mobileMenuOpen && (
                    <nav className="px-4 pb-4 space-y-2 border-t border-neutral-700">
                        <div className="pt-3">
                            {menuItems.map((item) => (
                                <MenuItem key={item.path} item={item} />
                            ))}
                        </div>
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

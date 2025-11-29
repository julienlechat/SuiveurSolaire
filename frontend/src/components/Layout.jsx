import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen md:h-screen bg-slate-100 md:flex md:overflow-hidden">
            {/* Sidebar (gère son propre responsive) */}
            <Sidebar />

            {/* Contenu principal - scrollable sur desktop */}
            <main className="flex-1 min-w-0 flex flex-col pt-14 md:pt-0 pb-6 md:overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

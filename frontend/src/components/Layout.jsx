import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    return (
        <div className="h-screen bg-slate-100 flex overflow-hidden">
            {/* Sidebar - fixe */}
            <Sidebar />

            {/* Contenu principal - scrollable */}
            <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
                {/* Padding top sur mobile pour la navbar fixe */}
                <div className="md:hidden h-14" />
                {children}
            </main>
        </div>
    );
}

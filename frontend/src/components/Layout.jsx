import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Contenu principal */}
            <main className="flex-1 min-w-0 flex flex-col">
                {/* Padding top sur mobile pour la navbar fixe */}
                <div className="md:hidden h-14" />
                {children}
            </main>
        </div>
    );
}

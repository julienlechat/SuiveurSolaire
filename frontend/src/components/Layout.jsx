import Sidebar from "./Sidebar";

export default function Layout({ children, currentPage, onNavigate }) {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

            {/* Contenu principal */}
            <main className="flex-1 min-w-0">
                {/* Padding top sur mobile pour la navbar fixe */}
                <div className="md:p-6 p-4 pt-20 md:pt-6">
                    {children}
                </div>
            </main>
        </div>
    );
}


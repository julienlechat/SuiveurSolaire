import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100 md:flex">
            {/* Sidebar (gère son propre responsive) */}
            <Sidebar />

            {/* Contenu principal */}
            <main className="flex-1 min-w-0 flex flex-col pt-14 md:pt-0 pb-6">
                {children}
            </main>
        </div>
    );
}

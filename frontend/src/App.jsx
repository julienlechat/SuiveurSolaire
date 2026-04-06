import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import PricingPage from "./pages/Pricing/PricingPage";
import ProductionPage from "./pages/Production/ProductionPage";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/dashboard" element={<Navigate to="/" replace />} />
                    <Route path="/production" element={<ProductionPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;

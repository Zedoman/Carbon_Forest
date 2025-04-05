import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Import components for routes
import TokenizationDashboard from "./components/tokenization/TokenizationDashboard";
import StablecoinWallet from "./components/wallet/StablecoinWallet";
import ForestViewer from "./components/metaverse/ForestViewer";
import Marketplace from "./components/marketplace/Marketplace";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import { Web3Provider } from './context/Web3Context';
import SustainabilityDashboard from "./components/sustainability/SustainabilityDashboard";

function App() {
  return (
    <Web3Provider>
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tokenization" element={<TokenizationDashboard />} />
        <Route path="/wallet" element={<StablecoinWallet />} />
        <Route path="/forest" element={<ForestViewer />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/sustainability" element={<SustainabilityDashboard />} />

        {/* Add this to allow Tempo routes to work */}
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
      </Routes>
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}
    </Suspense>
    </Web3Provider>
  );
}

export default App;

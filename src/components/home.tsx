import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import Header from "./layout/Header";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      <div className="container mx-auto flex flex-col items-center justify-center p-6 pt-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Carbon Forest Platform
        </h1>
        <p className="text-lg text-green-700 max-w-2xl text-center mb-8">
          Invest in tokenized forest land, earn carbon credits, and make a
          positive environmental impact
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          <FeatureCard
            title="Tokenization"
            description="Browse and invest in forest parcels with real-time carbon data"
            icon="🌳"
            path="/tokenization"
          />
          <FeatureCard
            title="Stablecoin Wallet"
            description="Manage your tokens and track carbon credit yields"
            icon="💰"
            path="/wallet"
          />
          <FeatureCard
            title="Metaverse Forest"
            description="Explore your forest in 3D and complete conservation tasks"
            icon="🌏"
            path="/forest"
          />
          <FeatureCard
            title="Marketplace"
            description="Trade forest tokens with other investors"
            icon="🛒"
            path="/marketplace"
          />
          <FeatureCard
            title="Sustainability"
            description="Visualize your environmental impact metrics"
            icon="📊"
            path="/sustainability"
          />
          <FeatureCard
            title="Dashboard"
            description="View all your investments and activities in one place"
            icon="📱"
            path="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  path: string;
}

function FeatureCard({ title, description, icon, path }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-green-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link to={path}>
        <Button className="bg-green-600 hover:bg-green-700">Explore</Button>
      </Link>
    </div>
  );
}

export default Home;

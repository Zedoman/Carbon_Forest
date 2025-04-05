import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Leaf, ArrowRight } from "lucide-react";
import Header from "../layout/Header";
import ForestParcelGrid from "./ForestParcelGrid";
import InvestmentForm from "./InvestmentForm";

interface ForestParcel {
  id: string;
  name: string;
  location: string;
  size: number;
  carbonPotential: number;
  expectedYield: number;
  price: number;
  imageUrl: string;
  biodiversityScore: number;
  waterConservation: number;
  airQualityImprovement: number;
}

const defaultParcels: ForestParcel[] = [
  {
    id: "1",
    name: "Amazon Rainforest Plot A",
    location: "Brazil",
    size: 500,
    carbonPotential: 2500,
    expectedYield: 8.5,
    price: 75000,
    imageUrl:
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
    biodiversityScore: 95,
    waterConservation: 90,
    airQualityImprovement: 85,
  },
  {
    id: "2",
    name: "Borneo Lowland Forest",
    location: "Indonesia",
    size: 350,
    carbonPotential: 1800,
    expectedYield: 7.2,
    price: 52000,
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    biodiversityScore: 88,
    waterConservation: 85,
    airQualityImprovement: 80,
  },
  {
    id: "3",
    name: "Congo Basin Reserve",
    location: "Democratic Republic of Congo",
    size: 620,
    carbonPotential: 3100,
    expectedYield: 9.1,
    price: 93000,
    imageUrl:
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80",
    biodiversityScore: 92,
    waterConservation: 88,
    airQualityImprovement: 90,
  },
  {
    id: "4",
    name: "Taiga Forest Preserve",
    location: "Russia",
    size: 800,
    carbonPotential: 2800,
    expectedYield: 6.8,
    price: 68000,
    imageUrl:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80",
    biodiversityScore: 82,
    waterConservation: 78,
    airQualityImprovement: 85,
  },
  {
    id: "5",
    name: "Costa Rican Cloud Forest",
    location: "Costa Rica",
    size: 280,
    carbonPotential: 1500,
    expectedYield: 8.9,
    price: 65000,
    imageUrl:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80",
    biodiversityScore: 96,
    waterConservation: 94,
    airQualityImprovement: 92,
  },
  {
    id: "6",
    name: "Appalachian Mixed Forest",
    location: "United States",
    size: 420,
    carbonPotential: 1900,
    expectedYield: 7.5,
    price: 58000,
    imageUrl:
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80",
    biodiversityScore: 84,
    waterConservation: 86,
    airQualityImprovement: 82,
  },
];

const TokenizationDashboard = () => {
  const [selectedParcel, setSelectedParcel] = useState<ForestParcel | null>(null);
  const [parcels] = useState<ForestParcel[]>(defaultParcels); // You can pass this as a prop if dynamic data comes from an API

  const handleParcelSelect = (parcel: ForestParcel) => {
    setSelectedParcel(parcel);
  };

  const handleInvestmentComplete = () => {
    setSelectedParcel(null); // Close the InvestmentForm after investment
  };

  // Calculate dynamic values
  const availableParcels = parcels.length;
  const uniqueRegions = new Set(parcels.map((parcel) => parcel.location)).size;
  const totalTokenizedArea = parcels.reduce((sum, parcel) => sum + parcel.size, 0);
  const averageYield =
    parcels.reduce((sum, parcel) => sum + parcel.expectedYield, 0) / parcels.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-green-800">
          Tokenization Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Available Parcels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{availableParcels}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Across {uniqueRegions} regions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Average Yield
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageYield.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground mt-1">
                Annual carbon credit return
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Total Tokenized Area
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalTokenizedArea.toLocaleString()} ha</div>
              <p className="text-sm text-muted-foreground mt-1">
                Protected forest land
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-700">
              Featured Forest Parcels
            </h2>
            <Button
              variant="outline"
              className="text-green-600 border-green-600"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <ForestParcelGrid parcels={parcels} onParcelSelect={handleParcelSelect} />
        </div>

        {selectedParcel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <InvestmentForm
                parcelId={selectedParcel.id}
                parcelName={selectedParcel.name}
                carbonPotential={`${selectedParcel.carbonPotential} tons CO₂/ha/year`}
                expectedYield={`${selectedParcel.expectedYield}% APY`}
                minInvestment={100} // You can adjust this value
                onInvestmentComplete={handleInvestmentComplete}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">
              Why Invest in Forest Tokens?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Environmental Impact</h3>
              <p className="text-gray-600">
                Directly fund forest conservation and restoration projects that
                sequester carbon and protect biodiversity.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Financial Returns</h3>
              <p className="text-gray-600">
                Earn carbon credits that can be traded or used to offset your
                own carbon footprint.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">
                Transparent Ownership
              </h3>
              <p className="text-gray-600">
                Blockchain technology ensures clear ownership rights and
                transparent impact tracking.
              </p>
            </div>
          </div>

          <Button className="mt-6 bg-green-600 hover:bg-green-700">
            Learn More About Tokenization
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenizationDashboard;
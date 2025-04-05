import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Info, Leaf, TrendingUp, Sprout } from "lucide-react";

interface ForestToken {
  id: string;
  name: string;
  location: string;
  size: string;
  carbonYield: string;
  carbonCredits: string; // New field for carbon credits
  yield: string; // New field for annual yield
  price: number;
  priceChange: number;
  imageUrl: string;
  rating: number;
  maturity: string;
}

interface TokenListingsProps {
  tokens?: ForestToken[];
  onTokenSelect?: (token: ForestToken) => void;
  filterApplied?: boolean;
}

const defaultTokens: ForestToken[] = [
  {
    id: "1",
    name: "Amazon Rainforest Parcel A",
    location: "Brazil, South America",
    size: "5 hectares",
    carbonYield: "25 tons/year",
    carbonCredits: "125 credits", // Mocked: 5 hectares * 25 tons/year
    yield: "5% / year", // Mocked yield based on carbon credit output
    price: 12500,
    priceChange: 2.4,
    imageUrl:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
    rating: 4,
    maturity: "15 years",
  },
  {
    id: "2",
    name: "Borneo Mangrove Reserve",
    location: "Indonesia, Asia",
    size: "3 hectares",
    carbonYield: "18 tons/year",
    carbonCredits: "54 credits",
    yield: "4% / year",
    price: 8750,
    priceChange: -1.2,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1719955783013-218981c48c89?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 3,
    maturity: "8 years",
  },
  {
    id: "3",
    name: "Congo Basin Forest",
    location: "Congo, Africa",
    size: "7 hectares",
    carbonYield: "32 tons/year",
    carbonCredits: "224 credits",
    yield: "6% / year",
    price: 15800,
    priceChange: 5.7,
    imageUrl:
      "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=80",
    rating: 5,
    maturity: "20 years",
  },
  {
    id: "4",
    name: "Taiga Forest Preserve",
    location: "Russia, Europe",
    size: "10 hectares",
    carbonYield: "22 tons/year",
    carbonCredits: "220 credits",
    yield: "4.5% / year",
    price: 18200,
    priceChange: 0.8,
    imageUrl:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80",
    rating: 4,
    maturity: "25 years",
  },
  {
    id: "5",
    name: "Costa Rica Cloud Forest",
    location: "Costa Rica, Central America",
    size: "2.5 hectares",
    carbonYield: "15 tons/year",
    carbonCredits: "37.5 credits",
    yield: "3.5% / year",
    price: 7500,
    priceChange: 3.2,
    imageUrl:
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80",
    rating: 4,
    maturity: "12 years",
  },
  {
    id: "6",
    name: "Appalachian Forest Tract",
    location: "USA, North America",
    size: "4 hectares",
    carbonYield: "12 tons/year",
    carbonCredits: "48 credits",
    yield: "3% / year",
    price: 9200,
    priceChange: -0.5,
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    rating: 3,
    maturity: "18 years",
  },
];

const TokenListings = ({
  tokens = defaultTokens,
  onTokenSelect = () => {},
  filterApplied = false,
}: TokenListingsProps) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Forest Token Listings</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filterApplied ? "Filters applied" : "No filters applied"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map((token) => (
          <Card
            key={token.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={token.imageUrl}
                alt={token.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                <Leaf className="h-3 w-3" />
                {token.carbonYield}
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{token.name}</CardTitle>
                  <CardDescription>{token.location}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {token.price.toLocaleString()} CC
                  </div>
                  <div
                    className={`text-sm ${token.priceChange >= 0 ? "text-green-600" : "text-red-600"} flex items-center justify-end`}
                  >
                    {token.priceChange >= 0 ? "+" : ""}
                    {token.priceChange}%
                    <TrendingUp
                      className={`h-3 w-3 ml-1 ${token.priceChange >= 0 ? "" : "transform rotate-180"}`}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Size</p>
                  <p className="font-medium">{token.size}</p>
                </div>
                <div>
                  <p className="text-gray-500">Maturity</p>
                  <p className="font-medium">{token.maturity}</p>
                </div>
                <div>
                  <p className="text-gray-500">Carbon Credits</p>
                  <p className="font-medium">{token.carbonCredits}</p>
                </div>
                <div>
                  <p className="text-gray-500">Yield</p>
                  <p className="font-medium">{token.yield}</p>
                </div>
                <div>
                  <p className="text-gray-500">Rating</p>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < token.rating ? "text-yellow-500" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Info className="h-4 w-4" />
                Details
              </Button>
              <Button onClick={() => onTokenSelect(token)}>Trade Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {tokens.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No forest tokens match your criteria</p>
          <Button variant="outline" className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export { defaultTokens };
export default TokenListings;
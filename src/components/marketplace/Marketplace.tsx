import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingCart, TrendingUp, Filter, History, Sprout, Globe } from "lucide-react";
import Header from "../layout/Header";
import MarketFilters from "./MarketFilters";
import TokenListings, { defaultTokens } from "./TokenListings";
import TradeModal from "./TradeModal";
import MetaverseModal from "../metaverse/MetaverseModal"; // Import the new MetaverseModal
import { useWeb3 } from "../../context/Web3Context";

interface FilterState {
  priceRange: [number, number];
  carbonYield: [number, number];
  location: string;
  forestTypes: string[];
  certifications: string[];
  searchQuery: string;
  sortBy: string;
}

interface ForestToken {
  id: string;
  name: string;
  location: string;
  size: string;
  carbonYield: string;
  carbonCredits: string;
  yield: string;
  price: number;
  priceChange: number;
  imageUrl: string;
  rating: number;
  maturity: string;
}

interface Trade {
  token: ForestToken;
  timestamp: string;
  bonusYield: number; // New field to track bonus yield
}

interface TradeHistory {
  [account: string]: Trade[];
}

const calculateMarketStats = (tokens: typeof defaultTokens) => {
  const activeListings = tokens.length;
  const totalPrice = tokens.reduce((sum, token) => sum + token.price, 0);
  const averagePrice = totalPrice / activeListings;
  const totalValue = totalPrice;
  const marketVolume = totalValue * 0.1;
  const uniqueSellers = Math.ceil(activeListings / 2);

  return {
    marketVolume,
    averagePrice,
    activeListings,
    uniqueSellers,
  };
};

const Marketplace = () => {
  const { account, isConnected } = useWeb3();

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 20000],
    carbonYield: [0, 50],
    location: "",
    forestTypes: [],
    certifications: [],
    searchQuery: "",
    sortBy: "newest",
  });

  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<ForestToken | null>(null);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [isMetaverseModalOpen, setIsMetaverseModalOpen] = useState(false);
  const [selectedForestForMetaverse, setSelectedForestForMetaverse] = useState<ForestToken | null>(null);

  useEffect(() => {
    if (account) {
      const storedHistory: TradeHistory = JSON.parse(localStorage.getItem("tradeHistory") || "{}");
      const accountHistory = storedHistory[account] || [];
      setTradeHistory(accountHistory);
    } else {
      setTradeHistory([]);
    }
  }, [account]);

  const handleTokenSelect = (token: ForestToken) => {
    if (!isConnected) {
      alert("Please connect your MetaMask wallet to trade.");
      return;
    }
    setSelectedToken(token);
    setIsTradeModalOpen(true);
  };

  const handleTradeConfirm = (token: ForestToken) => {
    if (!account) return;

    const newTrade: Trade = {
      token,
      timestamp: new Date().toLocaleString(),
      bonusYield: 0, // Initialize bonus yield
    };

    const storedHistory: TradeHistory = JSON.parse(localStorage.getItem("tradeHistory") || "{}");
    const accountHistory = storedHistory[account] || [];
    const updatedAccountHistory = [...accountHistory, newTrade];
    storedHistory[account] = updatedAccountHistory;

    localStorage.setItem("tradeHistory", JSON.stringify(storedHistory));
    setTradeHistory(updatedAccountHistory);
    setIsTradeModalOpen(false);
  };

  const handleDonateYield = (token: ForestToken) => {
    alert(`Donated yield from ${token.name} to reforestation projects via Pharos!`);
  };

  const handleVisitMetaverse = (token: ForestToken) => {
    setSelectedForestForMetaverse(token);
    setIsMetaverseModalOpen(true);
  };

  const handlePlantTree = (token: ForestToken) => {
    if (!account) return;

    // Mock bonus yield: +0.5% for planting a digital tree
    const bonusYieldIncrease = 0.5;

    const storedHistory: TradeHistory = JSON.parse(localStorage.getItem("tradeHistory") || "{}");
    const accountHistory = storedHistory[account] || [];
    const updatedAccountHistory = accountHistory.map((trade) =>
      trade.token.id === token.id
        ? { ...trade, bonusYield: trade.bonusYield + bonusYieldIncrease }
        : trade
    );
    storedHistory[account] = updatedAccountHistory;

    localStorage.setItem("tradeHistory", JSON.stringify(storedHistory));
    setTradeHistory(updatedAccountHistory);

    alert(
      `Planted a digital tree in ${token.name}! Earned +${bonusYieldIncrease}% bonus yield. This action will contribute to real-world reforestation.`
    );
  };

  const filteredTokens = defaultTokens
    .filter((token) => {
      const price = token.price;
      const carbonYield = parseFloat(token.carbonYield);
      return (
        price >= filters.priceRange[0] &&
        price <= filters.priceRange[1] &&
        carbonYield >= filters.carbonYield[0] &&
        carbonYield <= filters.carbonYield[1] &&
        (filters.location === "" || token.location.includes(filters.location)) &&
        (filters.forestTypes.length === 0 || filters.forestTypes.some((type: string) => token.name.includes(type))) &&
        (filters.certifications.length === 0 || filters.certifications.some((cert: string) => token.name.includes(cert))) &&
        (filters.searchQuery === "" || token.name.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      );
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "yield-high":
          return parseFloat(b.carbonYield) - parseFloat(a.carbonYield);
        case "size-large":
          return parseFloat(b.size) - parseFloat(a.size);
        case "newest":
        default:
          return parseInt(b.id) - parseInt(a.id);
      }
    });

  const marketStats = calculateMarketStats(filteredTokens);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-green-800">
          Forest Token Marketplace
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Market Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(marketStats.marketVolume).toLocaleString()} CC
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                24h trading volume
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Average Token Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {marketStats.averagePrice.toFixed(2)} CC
              </div>
              <p className="text-sm text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" /> +5.2%
                this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Active Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{marketStats.activeListings}</div>
              <p className="text-sm text-muted-foreground mt-1">
                From {marketStats.uniqueSellers} unique sellers
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MarketFilters onFilterChange={setFilters} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5 text-green-600" />
                  Available Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TokenListings
                  tokens={filteredTokens}
                  onTokenSelect={handleTokenSelect}
                  filterApplied={filters.searchQuery !== "" || filters.location !== "" || filters.forestTypes.length > 0 || filters.certifications.length > 0}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <div className="flex items-center gap-3 mb-4">
            <History className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">
              Trade History
            </h2>
          </div>
          {!isConnected ? (
            <p className="text-gray-500">Please connect your MetaMask wallet to view your trade history.</p>
          ) : tradeHistory.length === 0 ? (
            <p className="text-gray-500">No trades yet.</p>
          ) : (
            <div className="space-y-4">
              {tradeHistory.map((trade, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="font-medium">{trade.token.name}</p>
                  <p className="text-sm text-gray-500">
                    Traded for {trade.token.price.toLocaleString()} CC on {trade.timestamp}
                  </p>
                  <p className="text-sm text-gray-500">
                    Yield: {trade.token.yield} {trade.bonusYield > 0 && `(+${trade.bonusYield}% bonus)`}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDonateYield(trade.token)}
                      className="flex items-center gap-1"
                    >
                      <Sprout className="h-4 w-4" />
                      Donate Yield
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVisitMetaverse(trade.token)}
                      className="flex items-center gap-1"
                    >
                      <Globe className="h-4 w-4" />
                      Visit in Metaverse
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">
              Trading Guide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">How to Buy</h3>
              <p className="text-gray-600">
                Connect your wallet, browse available tokens, and make a
                purchase using CarbonCoin (CC) via our secure Pharos payment system.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">How to Sell</h3>
              <p className="text-gray-600">
                List your forest tokens on the marketplace, set your price in CC, and
                receive payment directly to your wallet.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Trading Fees</h3>
              <p className="text-gray-600">
                Low 1.5% transaction fee, with 0.5% going directly to forest
                conservation efforts.
              </p>
            </div>
          </div>

          <Button className="mt-6 bg-green-600 hover:bg-green-700">
            View Detailed Trading Guide
          </Button>
        </div>

        {selectedToken && (
          <TradeModal
            open={isTradeModalOpen}
            onOpenChange={setIsTradeModalOpen}
            tokenData={selectedToken}
            onTradeConfirm={handleTradeConfirm}
          />
        )}

        {selectedForestForMetaverse && (
          <MetaverseModal
            open={isMetaverseModalOpen}
            onOpenChange={setIsMetaverseModalOpen}
            tokenData={selectedForestForMetaverse}
            onPlantTree={handlePlantTree}
          />
        )}
      </div>
    </div>
  );
};

export default Marketplace;
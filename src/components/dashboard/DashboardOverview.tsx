import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  ArrowRight,
  Leaf,
  Wallet,
  BarChart3,
  Globe,
  ShoppingCart,
} from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { ethers } from "ethers";
import { EventLog } from "ethers"; // Import EventLog type for type narrowing

interface DashboardData {
  totalInvestment: number;
  parcelCount: number;
  carbonCredits: number;
  carbonCreditChange: number;
  environmentalImpact: string;
  speciesSupported: number;
  recentActivities: { description: string; timestamp: string }[];
}

const DashboardOverview: React.FC = () => {
  const { account, contracts, provider } = useWeb3();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalInvestment: 0,
    parcelCount: 0,
    carbonCredits: 0,
    carbonCreditChange: 0,
    environmentalImpact: "Low",
    speciesSupported: 0,
    recentActivities: [],
  });

  // Function to fetch dashboard data from smart contracts
  const fetchDashboardData = async () => {
    if (!account || !contracts.carbonForestToken || !contracts.carbonCredit || !provider) {
      return;
    }

    try {
      // Fetch total investment and parcel count
      const userTokens = await contracts.carbonForestToken.getUserTokens(account);
      let totalInvestment = 0;
      for (const tokenId of userTokens) {
        const tokenDetails = await contracts.carbonForestToken.getTokenDetails(tokenId);
        totalInvestment += parseFloat(ethers.formatEther(tokenDetails.price));
      }

      // Fetch carbon credits
      const carbonCredits = await contracts.carbonCredit.balanceOf(account);
      const formattedCarbonCredits = parseFloat(ethers.formatUnits(carbonCredits, 18));

      // Placeholder for carbon credit change (you'd need historical data for this)
      const carbonCreditChange = 4.2; // Static for now; calculate dynamically if you have historical data

      // Calculate environmental impact and species supported
      const parcelCount = userTokens.length;
      const speciesSupported = parcelCount * 28; // Assume 28 species per parcel
      const environmentalImpact = parcelCount > 2 ? "High" : parcelCount > 0 ? "Medium" : "Low";

      // Fetch recent activities (e.g., by listening to events)
      const filter = contracts.carbonForestToken.filters.TokenMinted(account);
      const events = await contracts.carbonForestToken.queryFilter(filter);
      const recentActivities = await Promise.all(
        events.slice(-3).map(async (event) => {
          // Narrow the type to EventLog
          if (!("eventName" in event)) {
            return { description: "Unknown event", timestamp: "N/A" };
          }

          const eventLog = event as EventLog;
          const tokenId = eventLog.args.tokenId.toString();

          // Fetch the block to get the timestamp
          const block = await provider.getBlock(eventLog.blockNumber);
          const timestamp = block ? new Date(block.timestamp * 1000).toLocaleDateString() : "N/A";

          return {
            description: `Purchased Forest Parcel #${tokenId}`,
            timestamp,
          };
        })
      );

      setDashboardData({
        totalInvestment,
        parcelCount,
        carbonCredits: formattedCarbonCredits,
        carbonCreditChange,
        environmentalImpact,
        speciesSupported,
        recentActivities,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", (error as Error).message);
    }
  };

  // Fetch data on mount and when account or contracts change
  useEffect(() => {
    fetchDashboardData();
  }, [account, contracts, provider]);

  // Listen for new token purchases to update the dashboard
  useEffect(() => {
    if (!contracts.carbonForestToken || !account) return;

    const handleTokenMinted = (to: string, tokenId: string) => {
      if (to.toLowerCase() === account.toLowerCase()) {
        fetchDashboardData(); // Refetch data when a new token is minted
      }
    };

    contracts.carbonForestToken.on("TokenMinted", handleTokenMinted);

    return () => {
      contracts.carbonForestToken.off("TokenMinted", handleTokenMinted);
    };
  }, [account, contracts]);

  return (
    <div className="container mx-auto p-6 bg-background">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Total Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${dashboardData.totalInvestment.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Across {dashboardData.parcelCount} forest parcels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Carbon Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.carbonCredits}</div>
            <p className="text-sm text-muted-foreground mt-1">
              +{dashboardData.carbonCreditChange}% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.environmentalImpact}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Supporting {dashboardData.speciesSupported}+ species
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-green-700">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Button className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700">
          <Leaf className="h-8 w-8" />
          <span>View Tokenization</span>
        </Button>

        <Button className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Wallet className="h-8 w-8" />
          <span>Manage Wallet</span>
        </Button>

        <Button className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700">
          <Globe className="h-8 w-8" />
          <span>Explore Forest</span>
        </Button>

        <Button className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700">
          <ShoppingCart className="h-8 w-8" />
          <span>Visit Marketplace</span>
        </Button>

        <Button className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700">
          <BarChart3 className="h-8 w-8" />
          <span>View Sustainability</span>
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-green-700">
        Recent Activity
      </h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No recent activities.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
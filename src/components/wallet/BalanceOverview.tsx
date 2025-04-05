import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Wallet,
  Leaf,
  BarChart3,
} from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { ethers } from "ethers";

const BalanceOverview = () => {
  const { account, contracts } = useWeb3();
  const [balanceData, setBalanceData] = useState({
    balance: 0,
    yieldAmount: 0,
    yieldPercentage: 0,
    carbonCredits: 0,
    tokenSymbol: "CFOREST",
  });

  const fetchBalanceData = async () => {
    if (!account || !contracts.stablecoin || !contracts.carbonCredit) {
      return;
    }

    try {
      // Fetch stablecoin balance
      const balance = await contracts.stablecoin.balanceOf(account);
      const formattedBalance = parseFloat(ethers.formatUnits(balance, 18));

      // Fetch carbon credits
      const carbonCredits = await contracts.carbonCredit.balanceOf(account);
      const formattedCarbonCredits = parseFloat(ethers.formatUnits(carbonCredits, 18));

      // Placeholder for yield data (you'd need to fetch this from the contract or calculate it)
      const yieldAmount = formattedBalance * 0.024; // Example: 2.4% monthly yield
      const yieldPercentage = 4.2; // Example: static percentage

      setBalanceData({
        balance: formattedBalance,
        yieldAmount,
        yieldPercentage,
        carbonCredits: formattedCarbonCredits,
        tokenSymbol: "CFOREST",
      });
    } catch (error) {
      console.log("Error fetching balance data:", error.message);
    }
  };

  useEffect(() => {
    fetchBalanceData();
  }, [account, contracts]);

  const handleRefresh = () => {
    fetchBalanceData();
  };

  return (
    <div className="w-full space-y-6 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Balance Card */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Stablecoin Balance
            </CardTitle>
            <CardDescription>
              Your current holdings and yield information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">
                  {balanceData.balance.toLocaleString()}
                </span>
                <span className="ml-2 text-xl">{balanceData.tokenSymbol}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Current Yield
                  </span>
                  <div className="flex items-center">
                    <Leaf className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-lg font-medium">
                      {balanceData.yieldAmount.toLocaleString()}
                    </span>
                    <span className="ml-1 text-green-500 text-sm">
                      (+{balanceData.yieldPercentage}%)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Carbon Credits
                  </span>
                  <div className="flex items-center">
                    <Leaf className="h-4 w-4 mr-1 text-green-600" />
                    <span className="text-lg font-medium">
                      {balanceData.carbonCredits.toLocaleString()} tons
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleRefresh}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Actions Card */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
            <CardDescription>
              Perform common wallet transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                className="h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                onClick={() => document.getElementById("send-tokens")?.click()}
              >
                <ArrowUpRight className="h-6 w-6 mb-1" />
                <span>Send Tokens</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700"
                onClick={() => document.getElementById("receive-tokens")?.click()}
              >
                <ArrowDownRight className="h-6 w-6 mb-1" />
                <span>Receive Tokens</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700"
                onClick={() => document.getElementById("buy-credits")?.click()}
              >
                <Wallet className="h-6 w-6 mb-1" />
                <span>Buy Carbon Credits</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center bg-amber-600 hover:bg-amber-700">
                <Leaf className="h-6 w-6 mb-1" />
                <span>Stake Tokens</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yield Information Card */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Yield Information</CardTitle>
          <CardDescription>
            Details about your carbon credit yield
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground">Daily Yield</span>
              <span className="text-2xl font-bold">
                +{(balanceData.yieldAmount / 30).toFixed(2)}
              </span>
              <span className="text-xs text-green-500">
                Based on current carbon sequestration
              </span>
            </div>
            <div className="flex flex-col p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground">
                Monthly Yield
              </span>
              <span className="text-2xl font-bold">
                +{balanceData.yieldAmount.toFixed(2)}
              </span>
              <span className="text-xs text-green-500">
                Projected for this month
              </span>
            </div>
            <div className="flex flex-col p-4 border rounded-lg">
              <span className="text-sm text-muted-foreground">
                Annual Projection
              </span>
              <span className="text-2xl font-bold">
                +{(balanceData.yieldAmount * 12).toFixed(2)}
              </span>
              <span className="text-xs text-green-500">
                Based on current rates
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceOverview;
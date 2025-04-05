import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Wallet, ArrowUpRight, ArrowDownLeft, History } from "lucide-react";
import Header from "../layout/Header";
import BalanceOverview from "./BalanceOverview";
import TransactionHistory from "./TransactionHistory";
import TransactionModal from "./TransactionModal";
import { useWeb3 } from "../../context/Web3Context";

const StablecoinWallet = () => {
  const { account, disconnect } = useWeb3();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"send" | "receive" | "swap" | "buy">("send");

  const handleQuickAction = (action: "send" | "receive" | "buy" | "history") => {
    if (action === "history") {
      // Scroll to transaction history or handle differently if needed
      document.getElementById("transaction-history")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setModalType(action);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-green-800">
          Stablecoin Wallet
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <BalanceOverview />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start bg-green-600 hover:bg-green-700"
                onClick={() => handleQuickAction("send")}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" /> Send Tokens
              </Button>
              <Button
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => handleQuickAction("receive")}
              >
                <ArrowDownLeft className="mr-2 h-4 w-4" /> Receive Tokens
              </Button>
              <Button
                className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                onClick={() => handleQuickAction("buy")}
              >
                <Wallet className="mr-2 h-4 w-4" /> Buy Carbon Credits
              </Button>
              <Button
                className="w-full justify-start bg-amber-600 hover:bg-amber-700"
                onClick={() => handleQuickAction("history")}
              >
                <History className="mr-2 h-4 w-4" /> View Transaction History
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8" id="transaction-history">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Transaction History
          </h2>
          <TransactionHistory />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Carbon Credit Yield
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Yield Rate</span>
                  <span className="font-medium">7.8% APY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Next Yield Payment</span>
                  <span className="font-medium">5 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Month Earnings</span>
                  <span className="font-medium">12.4 Credits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Earned (YTD)</span>
                  <span className="font-medium">87.2 Credits</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Connected Wallets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {account ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Wallet className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">MetaMask</p>
                        <p className="text-xs text-gray-500">
                          {account.slice(0, 6)}...{account.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={disconnect}>
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500">No wallet connected.</p>
                )}
                <Button className="w-full" variant="outline">
                  Connect Another Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <TransactionModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          initialType={modalType}
        />
      </div>
    </div>
  );
};

export default StablecoinWallet;
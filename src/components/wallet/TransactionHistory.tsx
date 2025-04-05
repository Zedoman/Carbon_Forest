import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Search,
  Filter,
  ChevronDown,
  Download,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { ethers } from "ethers";
import { EventLog } from "ethers";

interface Transaction {
  id: string;
  date: string;
  type: "deposit" | "withdrawal" | "yield" | "purchase" | "sale";
  amount: number;
  token: string;
  status: "completed" | "pending" | "failed";
  description: string;
}

const TransactionHistory: React.FC = () => {
  const { account, contracts, provider } = useWeb3();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Helper function to fetch logs in smaller block ranges
  const fetchLogsInRange = async (filter: any, fromBlock: number, toBlock: number, initialStep: number = 10) => {
    const logs: any[] = [];
    let currentFromBlock = fromBlock;
    let attempt = 0;

    while (currentFromBlock <= toBlock) {
      let currentStep = initialStep;
      let currentToBlock = Math.min(currentFromBlock + currentStep - 1, toBlock);
      console.log(`Attempt ${++attempt}: Fetching logs from block ${currentFromBlock} to ${currentToBlock} (${currentToBlock - currentFromBlock + 1} blocks)`);
      try {
        const chunkLogs = await provider.getLogs({
          ...filter,
          fromBlock: currentFromBlock,
          toBlock: currentToBlock,
        });
        console.log(`Fetched ${chunkLogs.length} logs from block ${currentFromBlock} to ${currentToBlock}`);
        logs.push(...chunkLogs);
        currentFromBlock = currentToBlock + 1;
      } catch (err) {
        console.error(`Attempt ${attempt} Error fetching logs from ${currentFromBlock} to ${currentToBlock}:`, err);
        if ((err as any).code === -32005) {
          const suggestedRange = (err as any).data;
          if (suggestedRange && suggestedRange.from && suggestedRange.to) {
            const suggestedFrom = parseInt(suggestedRange.from, 16);
            const suggestedTo = parseInt(suggestedRange.to, 16);
            console.log(`Suggested range: [${suggestedFrom}, ${suggestedTo}] (${suggestedTo - suggestedFrom + 1} blocks)`);
            if (suggestedFrom < toBlock && suggestedTo > fromBlock) {
              console.log(`Adjusting range to suggested: [${Math.max(suggestedFrom, fromBlock)}, ${Math.min(suggestedTo, toBlock)}]`);
              const adjustedLogs = await fetchLogsInRange(filter, Math.max(suggestedFrom, fromBlock), Math.min(suggestedTo, toBlock), Math.max(1, Math.floor((suggestedTo - suggestedFrom + 1) / 10)));
              logs.push(...adjustedLogs);
              currentFromBlock = Math.min(suggestedTo, toBlock) + 1;
            } else {
              console.log(`Reducing step size due to invalid suggested range`);
              currentStep = Math.max(1, Math.floor(currentStep / 2));
              currentToBlock = Math.min(currentFromBlock + currentStep - 1, toBlock);
            }
          } else {
            console.log(`No suggested range; reducing step size`);
            currentStep = Math.max(1, Math.floor(currentStep / 2));
            currentToBlock = Math.min(currentFromBlock + currentStep - 1, toBlock);
          }
          if (currentStep < 1) {
            console.error(`Step size too small; skipping range ${currentFromBlock} to ${currentToBlock}`);
            currentFromBlock = currentToBlock + 1;
          }
          continue;
        }
        console.error(`Non-recoverable error in fetchLogsInRange at attempt ${attempt}:`, err);
        break;
      }
    }

    console.log(`Total logs fetched: ${logs.length}`);
    return logs;
  };

  const fetchTransactions = async () => {
    if (!account || !contracts.stablecoin || !contracts.carbonCredit || !provider) {
      console.log("Missing dependencies for transactions:", {
        account,
        stablecoin: contracts.stablecoin,
        carbonCredit: contracts.carbonCredit,
        provider,
      });
      return;
    }

    try {
      const allTransactions: Transaction[] = [];

      // Fetch stablecoin transactions (Transfer events)
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 10000); // Increased to last 10000 blocks
      console.log(`Fetching transactions from block ${fromBlock} to ${latestBlock}`);
      const stablecoinFilter = contracts.stablecoin.filters.Transfer(account, null);
      const stablecoinEvents = await contracts.stablecoin.queryFilter(stablecoinFilter, fromBlock, latestBlock);
      for (const event of stablecoinEvents) {
        if (!("eventName" in event)) continue; // Skip if not an EventLog
        const eventLog = event as EventLog;
        const block = await provider.getBlock(eventLog.blockNumber);
        const timestamp = block ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString();
        allTransactions.push({
          id: eventLog.transactionHash,
          date: timestamp,
          type: "withdrawal",
          amount: parseFloat(ethers.formatUnits(eventLog.args.value, 18)),
          token: "CFRST",
          status: "completed",
          description: `Sent to ${eventLog.args.to}`,
        });
      }

      const stablecoinReceivedFilter = contracts.stablecoin.filters.Transfer(null, account);
      const stablecoinReceivedEvents = await contracts.stablecoin.queryFilter(stablecoinReceivedFilter, fromBlock, latestBlock);
      for (const event of stablecoinReceivedEvents) {
        if (!("eventName" in event)) continue;
        const eventLog = event as EventLog;
        const block = await provider.getBlock(eventLog.blockNumber);
        const timestamp = block ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString();
        allTransactions.push({
          id: eventLog.transactionHash,
          date: timestamp,
          type: "deposit",
          amount: parseFloat(ethers.formatUnits(eventLog.args.value, 18)),
          token: "CFRST",
          status: "completed",
          description: `Received from ${eventLog.args.from}`,
        });
      }

      // Fetch carbon credit transactions (Transfer events)
      const carbonCreditFilter = contracts.carbonCredit.filters.Transfer(account, null);
      const carbonCreditEvents = await contracts.carbonCredit.queryFilter(carbonCreditFilter, fromBlock, latestBlock);
      for (const event of carbonCreditEvents) {
        if (!("eventName" in event)) continue;
        const eventLog = event as EventLog;
        const block = await provider.getBlock(eventLog.blockNumber);
        const timestamp = block ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString();
        allTransactions.push({
          id: eventLog.transactionHash,
          date: timestamp,
          type: "sale",
          amount: parseFloat(ethers.formatUnits(eventLog.args.value, 18)),
          token: "CC",
          status: "completed",
          description: `Sold to ${eventLog.args.to}`,
        });
      }

      const carbonCreditReceivedFilter = contracts.carbonCredit.filters.Transfer(null, account);
      const carbonCreditReceivedEvents = await contracts.carbonCredit.queryFilter(carbonCreditReceivedFilter, fromBlock, latestBlock);
      for (const event of carbonCreditReceivedEvents) {
        if (!("eventName" in event)) continue;
        const eventLog = event as EventLog;
        const block = await provider.getBlock(eventLog.blockNumber);
        const timestamp = block ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString();
        allTransactions.push({
          id: eventLog.transactionHash,
          date: timestamp,
          type: "yield",
          amount: parseFloat(ethers.formatUnits(eventLog.args.value, 18)),
          token: "CC",
          status: "completed",
          description: `Carbon credit yield from ${eventLog.args.from}`,
        });
      }

      // Fetch failed transactions
      const txFilter = { from: account, fromBlock, toBlock: latestBlock };
      console.log(`Fetching transaction logs for user ${account} from block ${fromBlock} to ${latestBlock}`);
      const logs = await fetchLogsInRange(txFilter, fromBlock, latestBlock);
      const txHashes = new Set<string>(logs.map(log => log.transactionHash));
      console.log("Transaction Hashes:", Array.from(txHashes));

      for (const txHash of txHashes) {
        const tx = await provider.getTransaction(txHash);
        if (!tx) {
          console.log(`Transaction ${txHash} not found`);
          continue;
        }

        let receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
          try {
            receipt = await tx.wait();
          } catch (err) {
            console.error(`Error waiting for transaction ${txHash}:`, err);
            if ((err as any).code === "ACTION_REJECTED") {
              const block = await provider.getBlock(tx.blockNumber || latestBlock);
              const timestamp = block ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString();
              allTransactions.push({
                id: txHash,
                date: timestamp,
                type: "purchase", // Default type; adjust based on context if needed
                amount: 0, // Amount not available for failed transactions
                token: "N/A",
                status: "failed",
                description: "Transaction Rejected by User",
              });
            }
            continue;
          }
        }

        if (receipt && receipt.status === 0) {
          const block = await provider.getBlock(receipt.blockNumber);
          const timestamp = block ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString();
          let description = "Failed Transaction";
          try {
            let contractInterface;
            const txToAddress = tx.to?.toLowerCase();
            if (txToAddress === ethers.getAddress(contracts.stablecoin.target as string).toLowerCase()) {
              contractInterface = contracts.stablecoin.interface;
              description = "Failed to Send Stablecoin";
            } else if (txToAddress === ethers.getAddress(contracts.carbonCredit.target as string).toLowerCase()) {
              contractInterface = contracts.carbonCredit.interface;
              description = "Failed to Transfer Carbon Credit";
            }
            const decoded = contractInterface?.parseTransaction({ data: tx.data, value: tx.value });
            if (decoded) {
              description = `Failed to ${decoded.name}`;
            }
          } catch (err) {
            console.error(`Error decoding transaction ${txHash}:`, err);
          }
          allTransactions.push({
            id: txHash,
            date: timestamp,
            type: "purchase", // Default type; adjust based on context if needed
            amount: 0, // Amount not available for failed transactions
            token: "N/A",
            status: "failed",
            description,
          });
        }
      }

      // Sort transactions by date (newest first)
      allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setTransactions(allTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", (error as Error).message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [account, contracts, provider]);

  // Listen for new transactions
  useEffect(() => {
    if (!contracts.stablecoin || !contracts.carbonCredit) return;

    const handleTransfer = () => {
      fetchTransactions();
    };

    contracts.stablecoin.on("Transfer", handleTransfer);
    contracts.carbonCredit.on("Transfer", handleTransfer);

    return () => {
      contracts.stablecoin.off("Transfer", handleTransfer);
      contracts.carbonCredit.off("Transfer", handleTransfer);
    };
  }, [contracts]);

  // Filter transactions based on search query and filters
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      searchQuery === "" ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === null || tx.status === statusFilter;
    const matchesType = typeFilter === null || tx.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-blue-100 text-blue-800";
      case "withdrawal":
        return "bg-purple-100 text-purple-800";
      case "yield":
        return "bg-green-100 text-green-800";
      case "purchase":
        return "bg-indigo-100 text-indigo-800";
      case "sale":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setTypeFilter(null);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
          Transaction History
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("failed")}>
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Type
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTypeFilter(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTypeFilter("deposit")}>
                Deposit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("withdrawal")}>
                Withdrawal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("yield")}>
                Yield
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("purchase")}>
                Purchase
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("sale")}>
                Sale
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {(searchQuery || statusFilter || typeFilter) && (
            <Button variant="ghost" onClick={resetFilters} className="text-sm">
              Reset
            </Button>
          )}

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption>
            Transaction history for your Carbon Forest account.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">
                <div className="flex items-center">
                  Date & Time
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Token</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[250px]">Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}
                    >
                      {transaction.type.charAt(0).toUpperCase() +
                        transaction.type.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.type === "withdrawal" ? "-" : "+"}
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{transaction.token}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 mt-4">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-primary text-primary-foreground"
        >
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
};

export default TransactionHistory;
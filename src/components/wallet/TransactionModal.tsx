import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRightLeft, Send, Download, Info, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useWeb3 } from "../../context/Web3Context";
import { ethers } from "ethers";

const transactionSchema = z.object({
  type: z.enum(["send", "receive", "swap", "buy"]),
  amount: z.string().min(1, "Amount is required"),
  recipient: z.string().optional(),
  tokenType: z.enum(["carbon", "forest"]).optional(),
  swapTo: z.enum(["carbon", "forest"]).optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialType?: "send" | "receive" | "swap" | "buy";
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  open = false,
  onOpenChange,
  initialType = "send",
}) => {
  const { account, contracts } = useWeb3();
  const [transactionType, setTransactionType] = useState<"send" | "receive" | "swap" | "buy">(
    initialType
  );

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: initialType,
      amount: "",
      recipient: "",
      tokenType: "carbon",
    },
  });

  const onSubmit = async (data: TransactionFormValues) => {
    if (!account || !contracts.stablecoin || !contracts.carbonCredit) {
      alert("Please connect your wallet and ensure contracts are initialized.");
      return;
    }

    try {
      if (data.type === "send") {
        const amountInWei = ethers.parseEther(data.amount);
        const contract = data.tokenType === "carbon" ? contracts.carbonCredit : contracts.stablecoin;
        const tokenSymbol = data.tokenType === "carbon" ? "CC" : "CFRST";
        const tx = await contract.transfer(data.recipient, amountInWei);
        await tx.wait();
        alert(`Successfully sent ${data.amount} ${tokenSymbol} to ${data.recipient}`);
      } else if (data.type === "swap") {
        // Placeholder for swap logic (you'd need a swap contract or function)
        const amountInWei = ethers.parseEther(data.amount);
        // Example: Swap carbon credits for forest tokens (adjust based on your contract)
        alert(`Swapped ${data.amount} ${data.tokenType === "carbon" ? "CC" : "CFRST"} for ${parseFloat(data.amount) * 0.85} ${data.swapTo === "carbon" ? "CC" : "CFRST"}`);
      } else if (data.type === "buy") {
        const amountInWei = ethers.parseEther(data.amount);
        // Example: Buy carbon credits with stablecoins (adjust based on your contract)
        const tx = await contracts.carbonCredit.mint(account, amountInWei);
        await tx.wait();
        alert(`Successfully bought ${data.amount} CC`);
      }

      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.log("Transaction error:", error.message);
      alert("Transaction failed: " + error.message);
    }
  };

  const handleTransactionTypeChange = (value: "send" | "receive" | "swap" | "buy") => {
    setTransactionType(value);
    form.setValue("type", value);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(account || "");
    alert("Address copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-800">
            {transactionType === "send" && "Send Tokens"}
            {transactionType === "receive" && "Receive Tokens"}
            {transactionType === "swap" && "Swap Tokens"}
            {transactionType === "buy" && "Buy Carbon Credits"}
          </DialogTitle>
          <DialogDescription>
            {transactionType === "send" &&
              "Transfer your tokens to another wallet or project."}
            {transactionType === "receive" &&
              "Receive tokens from another wallet or source."}
            {transactionType === "swap" &&
              "Exchange between Carbon Credits and Forest Tokens."}
            {transactionType === "buy" &&
              "Purchase Carbon Credits using your stablecoins."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center space-x-2 mb-6">
          <Button
            variant={transactionType === "send" ? "default" : "outline"}
            className={
              transactionType === "send"
                ? "bg-green-600 hover:bg-green-700"
                : ""
            }
            onClick={() => handleTransactionTypeChange("send")}
          >
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
          <Button
            variant={transactionType === "receive" ? "default" : "outline"}
            className={
              transactionType === "receive"
                ? "bg-green-600 hover:bg-green-700"
                : ""
            }
            onClick={() => handleTransactionTypeChange("receive")}
          >
            <Download className="mr-2 h-4 w-4" />
            Receive
          </Button>
          <Button
            variant={transactionType === "swap" ? "default" : "outline"}
            className={
              transactionType === "swap"
                ? "bg-green-600 hover:bg-green-700"
                : ""
            }
            onClick={() => handleTransactionTypeChange("swap")}
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Swap
          </Button>
          <Button
            variant={transactionType === "buy" ? "default" : "outline"}
            className={
              transactionType === "buy"
                ? "bg-green-600 hover:bg-green-700"
                : ""
            }
            onClick={() => handleTransactionTypeChange("buy")}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Buy
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {transactionType === "send" && (
              <>
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Address</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the wallet address of the recipient.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select token type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="carbon">
                            Carbon Credits (CC)
                          </SelectItem>
                          <SelectItem value="forest">
                            Forest Tokens (CFRST)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose which token type to send.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {transactionType === "receive" && (
              <div className="p-6 border rounded-lg bg-gray-50">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Your Wallet Address</h3>
                    <p className="text-sm text-gray-600 mt-1 break-all">
                      {account || "Not connected"}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={handleCopyAddress}
                      disabled={!account}
                    >
                      Copy Address
                    </Button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Share this address with others to receive Carbon Credits or
                    Forest Tokens. Always verify the address before completing
                    any transaction.
                  </p>
                </div>
              </div>
            )}

            {transactionType === "swap" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tokenType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="carbon">
                              Carbon Credits (CC)
                            </SelectItem>
                            <SelectItem value="forest">
                              Forest Tokens (CFRST)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="swapTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || "forest"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="carbon">
                              Carbon Credits (CC)
                            </SelectItem>
                            <SelectItem value="forest">
                              Forest Tokens (CFRST)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="py-2 px-4 bg-gray-50 rounded-md mt-2">
                  <p className="text-sm text-gray-600 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Current exchange rate: 1 CC = 0.85 CFRST
                  </p>
                </div>
              </>
            )}

            {(transactionType === "send" || transactionType === "swap" || transactionType === "buy") && (
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>
                      {transactionType === "swap"
                        ? "Enter the amount you want to swap."
                        : transactionType === "buy"
                        ? "Enter the amount of Carbon Credits to buy."
                        : "Enter the amount you want to send."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {transactionType === "swap" && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">You will receive:</span>
                  <span className="font-medium">
                    {form.watch("amount")
                      ? parseFloat(form.watch("amount")) * 0.85
                      : "0.00"}
                    {form.watch("swapTo") === "forest" ? "CFRST" : "CC"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">Fee:</span>
                  <span className="text-sm">0.5%</span>
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange && onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {transactionType === "send" && "Send Tokens"}
                {transactionType === "receive" && "Done"}
                {transactionType === "swap" && "Swap Tokens"}
                {transactionType === "buy" && "Buy Credits"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
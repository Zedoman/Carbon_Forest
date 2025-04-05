import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const schemas = {
  buyToken: z.object({
    tokenId: z.string().min(1, 'Token ID is required'),
    amount: z.string().min(1, 'Amount is required'),
  }),
  sellToken: z.object({
    tokenId: z.string().min(1, 'Token ID is required'),
    price: z.string().min(1, 'Price is required'),
  }),
  invest: z.object({
    amount: z.string().min(1, 'Amount is required'),
    paymentMethod: z.enum(['stablecoin', 'crypto', 'fiat']),
  }),
};

interface DynamicFormProps {
  action: 'buyToken' | 'sellToken' | 'invest';
  onSuccess?: () => void;
  tokenId?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ action, onSuccess, tokenId }) => {
  const { account, contracts, connect } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = schemas[action] || z.object({});
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      tokenId: tokenId || '',
      amount: '',
      price: '',
      paymentMethod: 'stablecoin',
    },
  });

  const onSubmit = async (data: any) => {
    if (!account) {
      try {
        await connect();
        if (!account) {
          setError('Wallet connection failed. Please try again.');
          return;
        }
      } catch (err) {
        setError('Failed to connect wallet: ' + (err as Error).message);
        return;
      }
    }

    if (!contracts.stablecoin || !contracts.carbonForestToken || !contracts.marketplace) {
      setError('Contracts not initialized. Please reconnect your wallet.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (action === 'buyToken') {
        const { tokenId, amount } = data;
        const price = ethers.parseEther(amount);
        const tx = await contracts.marketplace.buyToken(tokenId, { value: price });
        await tx.wait();
      } else if (action === 'sellToken') {
        const { tokenId, price } = data;
        const priceInWei = ethers.parseEther(price);
        const tx = await contracts.marketplace.listToken(tokenId, priceInWei);
        await tx.wait();
      } else if (action === 'invest') {
        const { amount } = data;
        const amountInWei = ethers.parseEther(amount);
        const mintTx = await contracts.stablecoin.mint(account, amountInWei);
        await mintTx.wait();
        const tokenId = Math.floor(Math.random() * 1000);
        const mintTokenTx = await contracts.carbonForestToken.mint(account, tokenId, amountInWei);
        await mintTokenTx.wait();
      }

      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      if (err.code === 4001) {
        setError("Transaction rejected: You denied the transaction in MetaMask.");
      } else if (err.code === -32603) {
        setError("Transaction failed: Insufficient funds or gas limit too low.");
      } else if (err.code === "CALL_EXCEPTION") {
        setError("Transaction failed: Smart contract error. Please check the contract details.");
      } else {
        setError("An error occurred while processing the transaction. Please try again.");
      }
      if (process.env.NODE_ENV !== 'production') {
        console.log("Transaction error:", { code: err.code, message: err.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {action === 'buyToken' && 'Buy Forest Token'}
        {action === 'sellToken' && 'Sell Forest Token'}
        {action === 'invest' && 'Invest in Forest'}
      </h2>

      {success ? (
        <div className="p-4 bg-green-50 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-green-800">Transaction successful!</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {(action === 'buyToken' || action === 'sellToken') && (
              <FormField
                control={form.control}
                name="tokenId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter token ID" {...field} disabled={!!tokenId} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(action === 'buyToken' || action === 'invest') && (
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {action === 'sellToken' && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (in CFS)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {action === 'invest' && (
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stablecoin">Carbon Forest Stablecoin (CFS)</SelectItem>
                        <SelectItem value="crypto">Other Cryptocurrency</SelectItem>
                        <SelectItem value="fiat">Fiat Currency (via Pharos)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {error && (
              <div className="p-3 bg-red-50 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-red-800">{error}</p>
                  <Button
                    variant="link"
                    className="text-red-600 p-0 h-auto"
                    onClick={() => {
                      setError(null);
                      form.handleSubmit(onSubmit)();
                    }}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !account}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Processing...' : 'Submit'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default DynamicForm;
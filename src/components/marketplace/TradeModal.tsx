import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenData: ForestToken | null;
  onTradeConfirm: (token: ForestToken) => void;
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

const TradeModal: React.FC<TradeModalProps> = ({ open, onOpenChange, tokenData, onTradeConfirm }) => {
  const handleTrade = () => {
    if (tokenData) {
      onTradeConfirm(tokenData);
      alert(`Successfully traded ${tokenData.name} for ${tokenData.price.toLocaleString()} CC!`);
    }
  };

  if (!tokenData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trade {tokenData.name}</DialogTitle>
          <DialogDescription>
            You are about to trade this forest token. Review the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={tokenData.imageUrl}
              alt={tokenData.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div>
              <p className="font-medium">{tokenData.name}</p>
              <p className="text-sm text-gray-500">{tokenData.location}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium">{tokenData.price.toLocaleString()} CC</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carbon Yield</p>
              <p className="font-medium">{tokenData.carbonYield}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carbon Credits</p>
              <p className="font-medium">{tokenData.carbonCredits}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Yield</p>
              <p className="font-medium">{tokenData.yield}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Size</p>
              <p className="font-medium">{tokenData.size}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Maturity</p>
              <p className="font-medium">{tokenData.maturity}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleTrade}>Confirm Trade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TradeModal;
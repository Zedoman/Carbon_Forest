import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import DynamicForm from '../DynamicForm';

const InvestmentForm = ({
  parcelId = 'AMZ-042',
  parcelName = 'Amazon Rainforest Parcel A-42',
  carbonPotential = '4.2 tons CO₂/ha/year',
  expectedYield = '8.2% APY',
  minInvestment = 100,
  onInvestmentComplete = () => {},
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSuccess = () => {
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onInvestmentComplete();
  };

  return (
    <div className="w-full">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Invest in {parcelName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-500">Parcel ID</p>
              <p className="font-medium">{parcelId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Carbon Potential</p>
              <p className="font-medium">{carbonPotential}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Expected Yield</p>
              <p className="font-medium text-green-600">{expectedYield}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Minimum Investment</p>
              <p className="font-medium">{minInvestment} CFOR</p>
            </div>
          </div>

          <DynamicForm action="invest" onSuccess={handleSuccess} />

          <div className="bg-amber-50 p-4 rounded-lg flex items-start gap-3 mt-6">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Important Notice</p>
              <p className="text-sm text-amber-700">
                Forest tokens represent real-world assets and are subject to natural and market fluctuations. Your investment directly supports forest conservation and carbon sequestration efforts.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={onInvestmentComplete}>
            Cancel
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Investment Successful
            </DialogTitle>
            <DialogDescription>
              Your investment in {parcelName} has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm font-medium">Investment Amount:</p>
                <p className="text-sm">TBD CFOR</p>
                <p className="text-sm font-medium">Transaction ID:</p>
                <p className="text-sm">
                  TXN-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </p>
                <p className="text-sm font-medium">Estimated Annual Yield:</p>
                <p className="text-sm text-green-600">{expectedYield}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              You can view your forest tokens in your wallet and monitor their performance in the Impact Tracker.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={handleConfirmationClose}
              className="bg-green-600 hover:bg-green-700"
            >
              View My Forest Assets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentForm;
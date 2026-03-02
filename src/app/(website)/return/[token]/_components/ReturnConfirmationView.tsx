import React from 'react';
import { format } from 'date-fns';
import { ReturnData } from './types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Package, Truck, CheckCircle2 } from 'lucide-react';

export default function ReturnConfirmationView({ data }: { data: ReturnData }) {
    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'ExpressShipping':
                return <Truck className="w-5 h-5" />;
            case 'LocalDropOff':
                return <Package className="w-5 h-5" />;
            default:
                return <Package className="w-5 h-5" />;
        }
    };

    const getMethodLabel = (method: string) => {
        switch (method) {
            case 'ExpressShipping':
                return 'Express Shipping';
            case 'LocalDropOff':
                return 'Local Drop-Off';
            default:
                return method;
        }
    };

    return (
        <Card className="border-green-200">
            <CardHeader className="bg-green-50/50 rounded-t-xl border-b border-green-100 text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl text-green-900">Return Confirmed</CardTitle>
                <CardDescription className="text-base text-green-700/80 mt-2 max-w-md mx-auto">
                    Thank you for confirming your return. The lender has been notified.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg font-semibold mb-6 border-b pb-2">Return Details</h3>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                            <span className="text-primary">{getMethodIcon(data.returnMethod || '')}</span>
                            Return Method
                        </p>
                        <p className="font-medium">{getMethodLabel(data.returnMethod || '')}</p>
                    </div>

                    {data.trackingNumber && (
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Tracking Number</p>
                            <div className="flex items-center gap-2">
                                <p className="font-medium font-mono bg-secondary/50 px-2 py-0.5 rounded">{data.trackingNumber}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Confirmed On</p>
                        <p className="font-medium">
                            {data.returnConfirmedAt
                                ? format(new Date(data.returnConfirmedAt), 'MMM do, yyyy h:mm a')
                                : 'N/A'}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                        <Badge variant="outline" className="font-medium">{data.currentStatus || 'InTransit'}</Badge>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg flex gap-3 text-sm text-muted-foreground">
                    <Info className="w-5 h-5 text-primary flex-shrink-0" />
                    <p>
                        Please allow up to 48 hours for the lender to receive and verify the item once it arrives. Your deposit hold will be released upon successful inspection.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

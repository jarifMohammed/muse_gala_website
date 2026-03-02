import React from 'react';
import { format } from 'date-fns';
import { ReturnData } from './types';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { CalendarIcon, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ReturnInfoBox({ data }: { data: ReturnData }) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PickedUp':
            case 'Delivered':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Pending Return</Badge>;
            case 'ReturnInitiated':
            case 'DroppedOff':
            case 'InTransit':
                return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">Return Initiated</Badge>;
            case 'Returned':
                return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Returned</Badge>;
            case 'Overdue':
            case 'ReturnEscalated':
                return <Badge variant="destructive">Overdue</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formattedDate = format(new Date(data.returnDueDate), 'EEEE, MMMM do, yyyy');

    return (
        <Card className="mb-8 border-l-4 border-l-primary bg-primary/5">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-primary">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">Return Due Date</p>
                            <p className="font-semibold text-lg">{formattedDate}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1">
                        <p className="text-sm text-muted-foreground font-medium">Boking Status</p>
                        {getStatusBadge(data.currentStatus)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

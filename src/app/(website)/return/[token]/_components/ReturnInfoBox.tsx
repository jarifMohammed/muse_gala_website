import React from 'react';
import { format } from 'date-fns';
import { ReturnData } from './types';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

export default function ReturnInfoBox({ data }: { data: ReturnData }) {
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
                </div>
            </CardContent>
        </Card>
    );
}

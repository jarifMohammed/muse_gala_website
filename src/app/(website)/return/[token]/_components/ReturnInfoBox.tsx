import React from 'react';
import { format } from 'date-fns';
import { ReturnData } from './types';
import { CalendarIcon } from 'lucide-react';

export default function ReturnInfoBox({ data }: { data: ReturnData }) {
    const formattedDate = format(new Date(data.returnDueDate), 'EEEE, MMMM do, yyyy');

    return (
        <div className="flex flex-col items-center justify-center mb-12 py-6 border-y border-primary/5 bg-primary/[0.02]">
            <div className="flex items-center gap-2.5 text-muted-foreground uppercase tracking-widest text-[10px] font-semibold mb-2">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Return Due By</span>
            </div>
            <p className="text-lg font-light tracking-wide">{formattedDate}</p>
        </div>
    );
}

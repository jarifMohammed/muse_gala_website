import React from 'react';
import Image from 'next/image';
import { ReturnData } from './types';

export default function ReturnHeader({ data }: { data: ReturnData }) {
    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 text-center md:text-left">
            <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-lg overflow-hidden flex-shrink-0 bg-secondary/20">
                {data.dressImage ? (
                    <Image
                        src={data.dressImage}
                        alt={data.dressName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 128px, 160px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-center h-full pt-2">
                <h1 className="text-3xl font-bold mb-2">Hi {data.customerName.split(' ')[0]},</h1>
                <p className="text-muted-foreground mb-1 text-lg">Your rental period for the</p>
                <p className="text-xl font-semibold">
                    {data.dressName} <span className="text-muted-foreground font-normal">by {data.brand}</span>
                </p>
                <p className="text-muted-foreground mt-1">is coming to an end. It's time to return it.</p>
            </div>
        </div>
    );
}

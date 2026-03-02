import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReturnData } from './types';
import { toast } from 'sonner';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UploadCloud, CheckCircle2, Info } from 'lucide-react';
import Image from 'next/image';

const returnFormSchema = z.object({
    returnMethod: z.string().min(1, 'Please select a return method'),
    trackingNumber: z.string().optional(),
    returnNotes: z.string().optional(),
}).refine(data => {
    if (data.returnMethod === 'ExpressShipping' && !data.trackingNumber) {
        return false;
    }
    return true;
}, {
    message: "Tracking number is required for Express Shipping",
    path: ["trackingNumber"]
});

type ReturnFormValues = z.infer<typeof returnFormSchema>;

export default function ReturnForm({
    data,
    token,
    onSuccess
}: {
    data: ReturnData;
    token: string;
    onSuccess: () => void;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<ReturnFormValues>({
        resolver: zodResolver(returnFormSchema),
        defaultValues: {
            returnMethod: '',
            trackingNumber: '',
            returnNotes: ''
        }
    });

    const returnMethod = watch('returnMethod');

    const onSubmit = async (values: ReturnFormValues) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('returnMethod', values.returnMethod);
            if (values.trackingNumber) {
                formData.append('trackingNumber', values.trackingNumber);
            }
            if (values.returnNotes) {
                formData.append('returnNotes', values.returnNotes);
            }
            if (selectedFile) {
                formData.append('receiptPhoto', selectedFile);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/return/${token}/submit`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit return confirmation');
            }

            toast.success('Return confirmed successfully');
            onSuccess();
        } catch (error: Error | unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'An error occurred. Please try again.');
            } else {
                toast.error('An error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <Card className="mb-10">
            <div className="flex justify-center mb-6">
                <Image
                    src="/logo-black.svg"
                    height={80}
                    width={80}
                    alt="Logo"
                />
            </div>
            <CardHeader>
                <CardTitle className="text-xl">Confirm Your Return</CardTitle>
                <CardDescription>
                    Please provide details about how you are returning the item.
                    This is required to release any holds or finalize your rental.
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-base">Return Method <span className="text-red-500">*</span></Label>
                        <Controller
                            name="returnMethod"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid gap-3 sm:grid-cols-2"
                                >
                                    <div className="flex items-center space-x-2 border rounded-lg p-4 focus-within:ring-1 focus-within:ring-primary hover:bg-muted/50 transition-colors cursor-pointer bg-card">
                                        <RadioGroupItem value="LocalDropOff" id="LocalDropOff" />
                                        <Label htmlFor="LocalDropOff" className="flex-1 cursor-pointer">Local Drop-Off</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border rounded-lg p-4 focus-within:ring-1 focus-within:ring-primary hover:bg-muted/50 transition-colors cursor-pointer bg-card">
                                        <RadioGroupItem value="ExpressShipping" id="ExpressShipping" />
                                        <Label htmlFor="ExpressShipping" className="flex-1 cursor-pointer">Express Shipping</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                        {errors.returnMethod && <p className="text-sm text-destructive">{errors.returnMethod.message}</p>}
                    </div>

                    {(returnMethod === 'ExpressShipping' || returnMethod === 'StandardShipping') && (
                        <div className="space-y-2">
                            <Label htmlFor="trackingNumber">
                                Tracking Number
                                {returnMethod === 'ExpressShipping' && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            <Input
                                id="trackingNumber"
                                placeholder="Enter postal tracking number"
                                {...register('trackingNumber')}
                                className={errors.trackingNumber ? 'border-destructive' : ''}
                            />
                            {errors.trackingNumber && <p className="text-sm text-destructive">{errors.trackingNumber.message}</p>}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="returnNotes">Tracking Notes (Optional)</Label>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Info size={14} className="text-primary" />
                            <span>Please put the tracking link in the notes below</span>
                        </div>
                        <Textarea
                            id="returnNotes"
                            placeholder="Paste your tracking link or add additional notes here"
                            className="resize-y"
                            {...register('returnNotes')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="receiptPhoto" className="block mb-2">Upload Receipt or Photo (Optional)</Label>
                        <div
                            className="border-2 border-dashed border-input rounded-xl p-6 flex flex-col items-center justify-center bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors text-center"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                            />
                            {selectedFile ? (
                                <div className="flex flex-col items-center text-primary">
                                    <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" />
                                    <span className="font-medium text-foreground">{selectedFile.name}</span>
                                    <span className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                    <Button type="button" variant="link" size="sm" className="mt-2 text-primary" onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}>Remove file</Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-muted-foreground">
                                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground/50" />
                                    <p className="font-medium text-foreground">Click to upload or drag and drop</p>
                                    <p className="text-sm mt-1">SVG, PNG, JPG or PDF (max. 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t px-6 py-4 flex justify-end">
                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto min-w-[150px]">
                        {isSubmitting ? 'Submitting...' : 'Confirm Return'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

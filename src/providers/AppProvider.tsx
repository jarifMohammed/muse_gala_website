"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const AppProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}{' '}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-lg font-avenir md:text-xl py-4 px-6 min-h-[80px]',
          classNames: {
            success: 'bg-green-50/90 border border-green-500 text-green-700',
            error: 'bg-red-50/90 border border-red-500 text-red-700',
            info: 'bg-blue-50/90 border border-blue-500 text-blue-700',
            title: 'text-[16px] md:text-lg font-bold tracking-wider',
            description: 'text-sm text-gray-500',
          },
        }}
      />
      <NextTopLoader color="#891D33" showSpinner={false} />
    </QueryClientProvider>
  );
};

export default AppProvider;

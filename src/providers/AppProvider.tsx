"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const AppProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children} <Toaster richColors position="top-right" />
      <NextTopLoader color="#891D33" showSpinner={false} />
    </QueryClientProvider>
  );
};

export default AppProvider;

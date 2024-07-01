"use client";

import React from "react";
import ContentLayout from "../layouts/contentLayout";
import "@dotlottie/react-player/dist/index.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: RootLayoutProps) {
  return (
    <ContentLayout>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
          currency: "USD",
          enableFunding: "card,ideal",
          components: "googlepay,buttons",
        }}
      >
        {children}
      </PayPalScriptProvider>
    </ContentLayout>
  );
}

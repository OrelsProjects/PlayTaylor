"use client";

import React, { useEffect } from "react";
import ContentLayout from "../layouts/contentLayout";
import "@dotlottie/react-player/dist/index.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { initLogger } from "../../logger";
import { initEventTracker } from "../../eventTracker";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: RootLayoutProps) {
  useEffect(() => {
    initLogger();
    initEventTracker();
  }, []);

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

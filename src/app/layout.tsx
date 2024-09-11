import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/../firebase.config.admin";
import StoreProvider from "@/app/providers/StoreProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import SessionWrapper from "@/app/providers/SessionWrapper";
import React, { Suspense } from "react";
import AuthProvider from "@/app/providers/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import TopLoaderProvider from "@/app/providers/TopLoaderProvider";
import Script from "next/script";
import BackgroundProvider from "@/app/providers/BackgroundProvider";
import LoggersProvider from "@/app/providers/LoggersProvider";
import GameListenerProvider from "@/app/providers/GameListenerProvider";
import Loading from "@/components/ui/loading";
import ShowGameDataProvider from "@/app/providers/ShowGameDataProvider";

const APP_NAME = "Play Taylor";
const APP_DEFAULT_TITLE = "Play Taylor";
const APP_TITLE_TEMPLATE = "%s - Play Taylor";
const APP_DESCRIPTION = "Play Taylor!";

interface RootLayoutProps {
  children: React.ReactNode;
  locale: never;
}

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default function Layout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="font-montserrat">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#00000000" />
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
        <meta name="google-adsense-account" content="ca-pub-5564324340797928" />

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5564324340797928"
          crossOrigin="anonymous"
        ></Script>
      </head>
      <body className="!overscroll-none">
        <Suspense
          fallback={
            <Loading spinnerClassName="absolute top-1/2 left-1/2 h-10 w-10" />
          }
        >
          <StoreProvider>
            <SessionWrapper>
              <ThemeProvider>
                <AuthProvider>
                  <TopLoaderProvider />
                  <LoggersProvider />
                  <GameListenerProvider />
                  <ShowGameDataProvider />
                  <BackgroundProvider className="w-full h-svh flex flex-col background-gradient">
                    {children}
                  </BackgroundProvider>
                  <SpeedInsights />
                  <Analytics />
                </AuthProvider>
              </ThemeProvider>
            </SessionWrapper>
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

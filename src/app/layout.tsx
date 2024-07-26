import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../../firebase.config.admin";
import StoreProvider from "./providers/StoreProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import SessionWrapper from "./providers/SessionWrapper";
import React from "react";
import AuthProvider from "./providers/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import TopLoaderProvider from "./providers/TopLoaderProvider";
import Script from "next/script";
import * as toast from "react-toastify";

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
        <StoreProvider>
          <SessionWrapper>
            <ThemeProvider>
              {/* <toast.ToastContainer
                stacked
                newestOnTop
                autoClose={2500}
                draggablePercent={60}
                // className="!mb-16 z-[51]"
                transition={toast.Flip}
                position="bottom-center"
                pauseOnHover={false}
              /> */}

              <AuthProvider>
                <TopLoaderProvider />
                {children}
                <SpeedInsights />
                <Analytics />
              </AuthProvider>
            </ThemeProvider>
          </SessionWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

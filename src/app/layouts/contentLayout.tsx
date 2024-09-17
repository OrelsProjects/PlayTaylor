"use client";

import React from "react";
import "@/../firebase.config";
import type { Viewport } from "next";

import AuthProvider from "@/app/providers/AuthProvider";
import NotificationsProvider from "@/app/providers/NotificationsProvider";
import TopLoaderProvider from "@/app/providers/TopLoaderProvider";
import AnimationProvider from "@/app/providers/AnimationProvider";
import HeightProvider from "@/app/providers/HeightProvider";
import ContentProvider from "@/app/providers/ContentProvider";
import { cn } from "@/lib/utils";

interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentLayout({
  children,
  className,
}: RootLayoutProps) {
  return (
    <main className={cn(className)}>
      <NotificationsProvider />
      {/* <HeightProvider> */}
      <AuthProvider>
        <ContentProvider>
          <TopLoaderProvider />
          <AnimationProvider>{children}</AnimationProvider>
        </ContentProvider>
      </AuthProvider>
      {/* </HeightProvider> */}
    </main>
  );
}

export const viewport: Viewport = {
  themeColor: "#121212",
};

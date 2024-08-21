"use client";

import React, { useEffect } from "react";
import "../../../firebase.config";
import type { Viewport } from "next";

import AuthProvider from "../providers/AuthProvider";
import NotificationsProvider from "../providers/NotificationsProvider";
import TopLoaderProvider from "../providers/TopLoaderProvider";
import AnimationProvider from "../providers/AnimationProvider";
import HeightProvider from "../providers/HeightProvider";
import ContentProvider from "../providers/ContentProvider";
import { cn } from "../../lib/utils";

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
      <HeightProvider>
        <ContentProvider>
          <TopLoaderProvider />
          <AnimationProvider>{children}</AnimationProvider>
        </ContentProvider>
      </HeightProvider>
    </main>
  );
}

export const viewport: Viewport = {
  themeColor: "#121212",
};

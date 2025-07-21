"use client";

import React, { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "antd/dist/reset.css";
import "../styles/globals.scss";

import { App, ConfigProvider } from "antd";
import TopBar from "@/components/TopBar/TopBar";
import { usePathname } from "next/navigation";

import { AuthProvider } from "@/lib/auth-context";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideTopBar = pathname.startsWith("/login");

  // ⚠️ Important : ne créer le QueryClient qu'une seule fois
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 min
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <html lang="fr">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "var(--color-primary)",
                colorTextBase: "var(--color-text)",
                fontFamily: "var(--font-body)",
                borderRadius: 6,
              },
              cssVar: true,
            }}
          >
            <QueryClientProvider client={queryClient}>
              <App>
                <AuthProvider>
                  {!hideTopBar && <TopBar />}
                  {children}
                </AuthProvider>
              </App>
            </QueryClientProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

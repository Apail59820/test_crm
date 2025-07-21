"use client";

import { useAuth } from "@/lib/auth-context";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import FullPageLoader from "@/components/FullPageLoader/FullPageLoader";
import Footer from "@/components/Footer/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <FullPageLoader />;
  }

  return (
    <>
      {children}
      <Footer />
    </>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { App } from "antd";
import { useAuth } from "@/lib/auth-context";
import FullPageLoader from "@/components/FullPageLoader/FullPageLoader";

export default function ValidatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { message } = App.useApp();
  const messageShownRef = useRef(false);
  const [accessChecked, setAccessChecked] = useState(false);

  const VALIDATOR_ROLE = process.env.NEXT_PUBLIC_VALIDATOR_ROLE_ID;
  const ADMIN_ROLE = process.env.NEXT_PUBLIC_ADMIN_ROLE_ID;

  useEffect(() => {
    if (loading) return;

    const hasAccess = user?.role === ADMIN_ROLE || user?.role === VALIDATOR_ROLE;

    if (!user) {
      router.replace("/login");
    } else if (!hasAccess) {
      if (!messageShownRef.current) {
        messageShownRef.current = true;
        message.error(
          "Accès refusé : vous n'avez pas les droits pour consulter cette page.",
        );
      }
      router.replace("/");
    } else {
      setAccessChecked(true);
    }
  }, [user, loading, router, message, ADMIN_ROLE, VALIDATOR_ROLE]);

  if (loading || !user || !accessChecked) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}

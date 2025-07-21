import { useMemo } from "react";
import type { Contribution } from "@/types/contribution";

export function useContributions() {
  const data: Contribution[] = useMemo(
    () => [
      {
        id: "1",
        title: "Mairie de Nantes",
        sector: "Collectivité",
        author: "Arnaud Beun",
        visibility: "PUBLIC",
        createdAt: "2025-06-25",
      },
      {
        id: "2",
        title: "Eiffage Promotion",
        sector: "Promoteur",
        author: "Toi-même",
        visibility: "PRIVATE",
        createdAt: "2025-06-29",
      },
    ],
    [],
  );

  return { data };
}

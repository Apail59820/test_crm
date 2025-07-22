import { useQuery } from "@tanstack/react-query";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import type { Origin } from "../../models/types";

export function useOrigins() {
  return useQuery({
    queryKey: ["origins"],
    queryFn: () =>
      directus.request<Pick<Origin, "id" | "label">[]>(
        readItems("origins", { fields: ["id", "label"], sort: "label" }),
      ),
  });
}

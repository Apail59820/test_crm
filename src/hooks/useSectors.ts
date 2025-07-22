import { useQuery } from "@tanstack/react-query";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import type { Sector } from "../../models/types";

export function useSectors() {
  return useQuery({
    queryKey: ["sectors"],
    queryFn: () =>
      directus.request<Pick<Sector, "id" | "label">[]>(
        readItems("sectors", { fields: ["id", "label"], sort: "label" }),
      ),
  });
}

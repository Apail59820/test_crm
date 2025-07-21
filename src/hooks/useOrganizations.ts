import { useQuery } from "@tanstack/react-query";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import type { Organization } from "../../models/types";

async function fetchOrganizations(search: string) {
  return directus.request<Pick<Organization, "id" | "name">[]>(
    readItems("organizations", {
      fields: ["id", "name"],
      filter: search ? { name: { _icontains: search } } : undefined,
      sort: "name",
      limit: 5,
    }),
  );
}

export function useOrganizations(search: string) {
  return useQuery({
    queryKey: ["organizations", search],
    queryFn: () => fetchOrganizations(search),
    enabled: Boolean(search),
  });
}

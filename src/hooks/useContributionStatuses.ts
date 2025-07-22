import { useQuery } from "@tanstack/react-query";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import type { ContributionsStatus } from "../../models/types";

export function useContributionStatuses() {
  return useQuery({
    queryKey: ["contribution_statuses"],
    queryFn: () =>
      directus.request<Pick<ContributionsStatus, "id" | "label">[]>(
        readItems("contributions_status", { fields: ["id", "label"] })
      ),
  });
}

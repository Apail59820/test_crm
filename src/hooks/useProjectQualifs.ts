import { useQuery } from "@tanstack/react-query";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import type { ProjectQualif } from "../../models/types";

export function useProjectQualifs() {
  return useQuery({
    queryKey: ["project_qualifs"],
    queryFn: () =>
      directus.request<Pick<ProjectQualif, "id" | "label">[]>(
        readItems("project_qualifs", { fields: ["id", "label"], sort: "label" }),
      ),
  });
}

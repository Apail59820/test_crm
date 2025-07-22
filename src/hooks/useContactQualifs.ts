import { useQuery } from "@tanstack/react-query";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import type { ContactQualif } from "../../models/types";

export function useContactQualifs() {
  return useQuery({
    queryKey: ["contact_qualifs"],
    queryFn: () =>
      directus.request<Pick<ContactQualif, "id" | "label">[]>(
        readItems("contact_qualifs", { fields: ["id", "label"], sort: "label" }),
      ),
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { readItems, updateItem } from "@directus/sdk";
import { directus } from "@/lib/directus";

export function useArchiveContribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const statuses = await directus.request<{ id: string }[]>(
        readItems("contributions_status", {
          fields: ["id"],
          filter: { label: { _eq: "ARCHIVED" } },
          limit: 1,
        }),
      );
      const statusId = statuses[0]?.id;
      return directus.request(updateItem("contributions", id, { status: statusId }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      queryClient.invalidateQueries({ queryKey: ["contribution"] });
    },
  });
}

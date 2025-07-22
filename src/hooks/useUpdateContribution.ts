import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateItem } from "@directus/sdk";
import { directus } from "@/lib/directus";

export function useUpdateContribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      return directus.request(updateItem("contributions", id, data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      queryClient.invalidateQueries({ queryKey: ["contribution"] });
    },
  });
}

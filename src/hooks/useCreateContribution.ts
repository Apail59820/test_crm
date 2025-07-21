import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem } from "@directus/sdk";
import { directus } from "@/lib/directus";

export type NewContributionPayload = {
  organization?: string;
  organizationName?: string;
  sector?: string;
  contactType?: string;
  qualification?: string;
  visibility?: string;
  summary?: string;
};

export function useCreateContribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: NewContributionPayload) => {
      let organizationId = payload.organization;

      if (!organizationId && payload.organizationName) {
        const org = await directus.request<{ id: string }>(
          createItem("organizations", { name: payload.organizationName }),
        );
        organizationId = org.id;
      }

      const contribution: Record<string, unknown> = {
        organization: organizationId,
        sector_activity: payload.sector,
        contact_origin: payload.contactType,
        project_qualification: payload.qualification,
        is_public: payload.visibility === "PUBLIC",
        notes_raw: payload.summary,
      };

      return directus.request(createItem("contributions", contribution));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
    },
  });
}

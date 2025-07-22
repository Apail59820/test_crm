import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem } from "@directus/sdk";
import { directus } from "@/lib/directus";

export type NewContributionPayload = {
  organization?: string;
  organizationName?: string;
  sector?: string;
  contactOrigin?: string;
  contactQualification?: string;
  projectQualification?: string;
  visibility?: string;
  summary?: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  region: string;
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

      const contact = await directus.request<{ id: string }>(
        createItem("contacts", {
          organization: organizationId,
          first_name: payload.firstName,
          last_name: payload.lastName,
          position: payload.position,
          email: payload.email,
          phone: payload.phone,
          region: payload.region,
          is_primary: true,
        }),
      );

      const contribution: Record<string, unknown> = {
        organization: organizationId,
        contact: contact.id,
        contact_function: payload.position,
        contact_email: payload.email,
        contact_phone: payload.phone,
        sector_activity: payload.sector,
        contact_origin: payload.contactOrigin,
        contact_qualification: payload.contactQualification,
        project_qualification: payload.projectQualification,
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

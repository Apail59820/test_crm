import { useQuery } from "@tanstack/react-query";
import { readItem } from "@directus/sdk";
import { directus } from "@/lib/directus";
import type {
  Contribution as DirectusContribution,
  Contact,
  Organization,
  Sector,
  Origin,
  ContactQualif,
  ProjectQualif,
  ContributionsStatus,
  DirectusUser,
} from "../../models/types";

export type ContributionDetails = Omit<
  DirectusContribution,
  | "organization"
  | "sector_activity"
  | "contact"
  | "contact_origin"
  | "contact_qualification"
  | "project_qualification"
  | "user_created"
  | "status"
> & {
  organization: Pick<Organization, "id" | "name"> | null;
  sector_activity: Pick<Sector, "id" | "label"> | null;
  contact: (Pick<Contact, "id" | "first_name" | "last_name" | "position" | "email" | "phone" | "region">) | null;
  contact_origin: Pick<Origin, "id" | "label"> | null;
  contact_qualification: Pick<ContactQualif, "id" | "label"> | null;
  project_qualification: Pick<ProjectQualif, "id" | "label"> | null;
  user_created: Pick<DirectusUser, "first_name" | "last_name" | "email"> | null;
  status: Pick<ContributionsStatus, "id" | "label"> | null;
};

export function useContribution(id?: string) {
  return useQuery({
    queryKey: ["contribution", id],
    queryFn: async () => {
      if (!id) return null;
      return directus.request<ContributionDetails>(
        readItem("contributions", id, {
          fields: [
            "id",
            "notes_raw",
            "meeting_date",
            "reminder_date",
            "is_public",
            "contact_function",
            "contact_email",
            "contact_phone",
            { organization: ["id", "name"] },
            { sector_activity: ["id", "label"] },
            {
              contact: [
                "id",
                "first_name",
                "last_name",
                "position",
                "email",
                "phone",
                "region",
              ],
            },
            { contact_origin: ["id", "label"] },
            { contact_qualification: ["id", "label"] },
            { project_qualification: ["id", "label"] },
            { user_created: ["first_name", "last_name", "email"] },
            { status: ["id", "label"] },
          ],
        }),
      );
    },
    enabled: Boolean(id),
  });
}

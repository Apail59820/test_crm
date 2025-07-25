import { useQuery } from "@tanstack/react-query";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import type {
  Contribution as DirectusContribution,
  ContributionsStatus,
  DirectusUser,
  Organization,
  Contact,
} from "../../models/types";

export type NewsletterContribution = {
  id: string;
  organization: string;
  region: string;
  contributor: string;
  date: string;
  summary: string;
  visibility: "PUBLIC" | "PRIVATE" | "ARCHIVED";
  status: string;
};

export function useNewsletterContributions({
  startDate,
  endDate,
  userIds,
  enabled = true,
}: {
  startDate?: string;
  endDate?: string;
  userIds?: string[];
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["newsletter_contributions", startDate, endDate, userIds],
    queryFn: async () => {
      const filter: Record<string, unknown> = {};

      if (startDate && endDate) {
        filter.date_created = { _between: [startDate, endDate] };
      }

      if (userIds?.length) {
        filter.user_created = { _in: userIds };
      }

      filter.status = { id: { _eq: "pending_validation" } };

      const items = await directus.request<
        (Pick<DirectusContribution, "id" | "date_created" | "notes_raw" | "is_public" | "meeting_date"> & {
          organization: Pick<Organization, "name">;
          contact: Pick<Contact, "region">;
          user_created: Pick<DirectusUser, "first_name" | "last_name" | "email">;
          status: Pick<ContributionsStatus, "label">;
        })[]
      >(readItems("contributions", {
        fields: [
          "id",
          "date_created",
          "meeting_date",
          "notes_raw",
          "is_public",
          { organization: ["name"] },
          { contact: ["region"] },
          { user_created: ["first_name", "last_name", "email"] },
          { status: ["label"] },
        ],
        filter,
        sort: "-date_created",
        limit: -1,
      }));

      return items.map<NewsletterContribution>((item) => ({
        id: item.id,
        organization: item.organization?.name ?? "",
        region: (item.contact as Contact)?.region ?? "",
        contributor:
          [item.user_created?.first_name, item.user_created?.last_name]
            .filter(Boolean)
            .join(" ") ||
          item.user_created?.email ||
          "",
        date: String(item.meeting_date ?? item.date_created),
        summary: item.notes_raw ?? "",
        visibility:
          item.status?.label === "ARCHIVED"
            ? "ARCHIVED"
            : item.is_public
              ? "PUBLIC"
              : "PRIVATE",
        status: item.status?.label ?? "",
      }));
    },
    enabled,
  });
}

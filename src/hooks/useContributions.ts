import { useQuery } from "@tanstack/react-query";
import { readItems } from "@directus/sdk";
import type { Contribution } from "@/types/contribution";
import { directus } from "@/lib/directus";
import { useAuth } from "@/lib/auth-context";
import type {
  Contact,
  ContactQualif,
  Contribution as DirectusContribution,
  ContributionsStatus,
  DirectusUser,
  Organization,
  ProjectQualif,
  Sector,
} from "../../models/types";

type DirectusContributionExpanded = Omit<
  DirectusContribution,
  "organization" | "sector_activity" | "user_created" | "status"
> & {
  organization: Pick<Organization, "name">;
  sector_activity: Pick<Sector, "label">;
  user_created: Pick<DirectusUser, "first_name" | "last_name" | "email">;
  status: Pick<ContributionsStatus, "label">;
};

export function useContributions(
  tab: "all" | "mine" | "public",
  {
    search,
    sector,
    visibility,
    page = 1,
    limit = 10,
  }: {
    search?: string;
    sector?: string;
    visibility?: string;
    page?: number;
    limit?: number;
  } = {},
) {
  const { user, loading } = useAuth();

  return useQuery({
    queryKey: [
      "contributions",
      tab,
      user?.id,
      search,
      sector,
      visibility,
      page,
      limit,
    ],
    queryFn: async () => {
      try {
        const filter: Record<string, unknown> = {};

        if (tab === "public") {
          filter.is_public = { _eq: true };
        } else if (tab === "mine" && user) {
          filter.user_created = { _eq: user.id };
        }

        if (visibility) {
          if (visibility === "ARCHIVED") {
            filter["status"] = { label: { _eq: "ARCHIVED" } };
          } else {
            filter.is_public = { _eq: visibility === "PUBLIC" };
          }
        }

        if (sector) {
          filter["sector_activity"] = { label: { _eq: sector } };
        }

        if (search) {
          filter["organization"] = { name: { _icontains: search } };
        }

        const items = await directus.request<DirectusContributionExpanded[]>(
          readItems("contributions", {
            fields: [
              "id",
              "date_created",
              "is_public",
              "contact_function",
              { contact_qualification: ["label"] },
              { project_qualification: ["label"] },
              { contact: ["first_name", "last_name"] },
              { organization: ["name"] },
              { sector_activity: ["label"] },
              { user_created: ["first_name", "last_name", "email"] },
              { status: ["label"] },
              "summary"
            ],
            sort: "-date_created",
            filter,
            limit,
            page,
          }),
        );

        return items.map<Contribution>((item) => ({
          id: item.id,
          title: item.organization?.name ?? "",
          sector: item.sector_activity?.label ?? "",
          author:
            [item.user_created?.first_name, item.user_created?.last_name]
              .filter(Boolean)
              .join(" ") ||
            item.user_created?.email ||
            "",
          visibility:
            item.status?.label === "ARCHIVED"
              ? "ARCHIVED"
              : item.is_public
                ? "PUBLIC"
                : "PRIVATE",
          createdAt: String(item.date_created),
          client: {
            name: `${(item.contact as Contact)?.first_name} ${(item.contact as Contact)?.last_name}`,
            function: item.contact_function,
            type: (item.contact_qualification as ContactQualif)?.label,
          },
          qualification: (item.project_qualification as ProjectQualif)?.label,
          summary: item.summary ?? "",
        }));
      } catch (err) {
        console.error("💥 useContributions error:", err);
        return [];
      }
    },
    enabled: !loading && (tab !== "mine" || Boolean(user)),
    placeholderData: [] as Contribution[],
  });
}

import { useEffect, useState } from "react";
import { readItems } from "@directus/sdk";
import type { Contribution } from "@/types/contribution";
import { directus } from "@/lib/directus";
import type {
  Contribution as DirectusContribution,
  Organization,
  Sector,
  DirectusUser,
  ContributionsStatus,
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

export function useContributions() {
  const [data, setData] = useState<Contribution[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const items = await directus.request<DirectusContributionExpanded[]>(
          readItems("contributions", {
            fields: [
              "id",
              "date_created",
              "is_public",
              { organization: ["name"] },
              { sector_activity: ["label"] },
              { user_created: ["first_name", "last_name", "email"] },
              { status: ["label"] },
            ],
            sort: "-date_created",
          }),
        );

        const mapped = items.map<Contribution>((item) => ({
          id: item.id,
          title:
            typeof item.organization === "object" ? item.organization.name : "",
          sector:
            typeof item.sector_activity === "object"
              ? item.sector_activity.label
              : "",
          author:
            typeof item.user_created === "object"
              ?
                  ([item.user_created.first_name, item.user_created.last_name]
                    .filter(Boolean)
                    .join(" ") || item.user_created.email)
              : "",
          visibility:
            typeof item.status === "object" && item.status.label === "ARCHIVED"
              ? "ARCHIVED"
              : item.is_public
                ? "PUBLIC"
                : "PRIVATE",
          createdAt: String(item.date_created),
        }));

        setData(mapped);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return { data };
}

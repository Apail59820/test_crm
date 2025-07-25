import { useQuery } from "@tanstack/react-query";
import { readItems, readUsers } from "@directus/sdk";
import dayjs from "dayjs";
import { directus } from "@/lib/directus";
import type { Contribution as DirectusContribution, DirectusUser } from "../../models/types";

export interface ParticipationStat {
  id: string;
  name: string;
  avatar?: string;
  entity?: string;
  region?: string;
  hasContributed: boolean;
  contributionCount: number;
  lastContribution?: string;
}

export function useParticipationStats({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["participation_stats", startDate, endDate],
    queryFn: async () => {
      const filter: Record<string, unknown> = {};

      if (startDate && endDate) {
        filter.date_created = { _between: [startDate, endDate] };
      }

      const contributions = await directus.request<
        (Pick<DirectusContribution, "user_created" | "date_created"> & {
          user_created: Pick<DirectusUser, "id">;
        })[]
      >(
        readItems("contributions", {
          fields: ["date_created", { user_created: ["id"] }],
          filter,
          limit: -1,
        })
      );

      const statsMap: Record<string, ParticipationStat> = {};
      for (const item of contributions) {
        const userId =
          typeof item.user_created === "string"
            ? item.user_created
            : item.user_created.id;
        if (!userId) continue;

        const stat = statsMap[userId] || {
          id: userId,
          name: "",
          hasContributed: false,
          contributionCount: 0,
        };

        stat.contributionCount += 1;

        const date = String(item.date_created);
        if (!stat.lastContribution || dayjs(date).isAfter(stat.lastContribution)) {
          stat.lastContribution = date;
        }

        statsMap[userId] = stat;
      }

      const weekContributions = await directus.request<
        (Pick<DirectusContribution, "user_created"> & {
          user_created: Pick<DirectusUser, "id">;
        })[]
      >(
        readItems("contributions", {
          fields: [{ user_created: ["id"] }],
          filter: {
            date_created: {
              _between: [
                dayjs().startOf("week").toISOString(),
                dayjs().endOf("week").toISOString(),
              ],
            },
          },
          limit: -1,
        })
      );

      for (const item of weekContributions) {
        const userId =
          typeof item.user_created === "string"
            ? item.user_created
            : item.user_created.id;
        if (!userId) continue;
        if (!statsMap[userId]) {
          statsMap[userId] = {
            id: userId,
            name: "",
            contributionCount: 0,
            hasContributed: true,
          };
        } else {
          statsMap[userId].hasContributed = true;
        }
      }

      const userIds = Object.keys(statsMap);
      if (userIds.length) {
        const users = await directus.request<
          (Pick<DirectusUser, "id" | "first_name" | "last_name" | "email" | "avatar"> & {
            region?: string;
            entity?: string;
          })[]
        >(
          readUsers({
            fields: ["id", "first_name", "last_name", "email", "avatar", "region", "entity"],
            filter: { id: { _in: userIds } },
            limit: -1,
          })
        );

        for (const user of users) {
          const stat = statsMap[user.id];
          if (!stat) continue;
          stat.name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;
          stat.avatar = user.avatar ?? undefined;
          stat.region = user.region ?? "";
          stat.entity = user.entity ?? "";
        }
      }

      return Object.values(statsMap);
    },
  });
}

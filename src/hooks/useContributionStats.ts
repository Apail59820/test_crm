import { useQuery } from "@tanstack/react-query";
import { readItems } from "@directus/sdk";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { directus } from "@/lib/directus";
import type {
  Contribution as DirectusContribution,
  ContributionsStatus,
} from "../../models/types";

dayjs.extend(isoWeek);

export type ContributionStats = {
  donutData: { name: string; value: number }[];
  lineData: { week: string; total: number }[];
  barData: Record<string, unknown>[];
};

export function useContributionStats({
  startDate,
  endDate,
  userIds,
}: {
  startDate?: string;
  endDate?: string;
  userIds?: string[];
}) {
  return useQuery({
    queryKey: ["contribution_stats", startDate, endDate, userIds],
    queryFn: async () => {
      const filter: Record<string, unknown> = {};

      if (startDate && endDate) {
        filter.date_created = { _between: [startDate, endDate] };
      }

      if (userIds?.length) {
        filter.user_created = { _in: userIds };
      }

      const items = await directus.request<
        (Pick<DirectusContribution, "date_created"> & {
          status: Pick<ContributionsStatus, "label">;
        })[]
      >(
        readItems("contributions", {
          fields: ["date_created", { status: ["label"] }],
          filter,
          limit: -1,
        }),
      );

      const statusCounts: Record<string, number> = {};
      const weeklyCounts: Record<string, number> = {};
      const weeklyByStatus: Record<string, Record<string, number>> = {};

      for (const item of items) {
        const status = item.status?.label || "";
        const week = dayjs(String(item.date_created)).format("[S]WW");

        statusCounts[status] = (statusCounts[status] || 0) + 1;
        weeklyCounts[week] = (weeklyCounts[week] || 0) + 1;

        if (!weeklyByStatus[week]) {
          weeklyByStatus[week] = {};
        }
        weeklyByStatus[week][status] = (weeklyByStatus[week][status] || 0) + 1;
      }

      const donutData = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      }));

      const lineData = Object.entries(weeklyCounts)
        .map(([week, total]) => ({ week, total }))
        .sort((a, b) => a.week.localeCompare(b.week));

      const barData = Object.entries(weeklyByStatus)
        .map(([week, values]) => ({ week, ...values }))
        .sort((a, b) => a.week.localeCompare(b.week));

      return { donutData, lineData, barData };
    },
  });
}

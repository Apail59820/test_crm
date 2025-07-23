'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { StatCard } from "@/components/StatCard/StatCard";
import styles from "./ContributionStatusChart.module.scss";
import { useContributionStats } from "@/hooks/useContributionStats";
import type { NewsletterFilterValues } from "@/components/NewsletterFilters/NewsletterFilters";
import { useEffect } from "react";

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#f44336"];

export default function ContributionStatusChart({
  filters,
}: {
  filters: NewsletterFilterValues | null;
}) {
  const { data } = useContributionStats({
    startDate: filters?.range?.[0]?.toISOString(),
    endDate: filters?.range?.[1]?.toISOString(),
    userIds: filters && !filters.all ? filters.users : undefined,
  });

  const donutData = data?.donutData ?? [];
  const lineData = data?.lineData ?? [];
  const barData = data?.barData ?? [];

  const statusKeys = donutData.map((d) => d.name);
  const colorMap = statusKeys.reduce<Record<string, string>>((acc, key, idx) => {
    acc[key] = COLORS[idx % COLORS.length];
    return acc;
  }, {});

  return (
    <div className={styles.grid}>
      <StatCard
        title="Répartition des contributions"
        subtitle="Par statut"
        content={
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorMap[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        }
      />

      <StatCard
        title="Évolution hebdomadaire"
        subtitle="Nombre total de contributions"
        content={
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#3f51b5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        }
      />

      <StatCard
        title="Comparaison par statut"
        subtitle="Par semaine"
        content={
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              {statusKeys.map((key) => (
                <Bar key={key} dataKey={key} fill={colorMap[key]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        }
      />
    </div>
  );
}

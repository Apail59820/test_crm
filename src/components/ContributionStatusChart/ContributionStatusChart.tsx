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

const COLORS = ["#4caf50", "#ff9800", "#f44336"];

const donutData = [
  { name: "Publiques", value: 12 },
  { name: "Privées", value: 8 },
  { name: "Archivées", value: 5 },
];

const barData = [
  { name: "Semaine 27", Publiques: 8, Privées: 4, Archivées: 2 },
  { name: "Semaine 28", Publiques: 10, Privées: 3, Archivées: 3 },
  { name: "Semaine 29", Publiques: 12, Privées: 5, Archivées: 5 },
];

const lineData = [
  { semaine: "S27", total: 14 },
  { semaine: "S28", total: 16 },
  { semaine: "S29", total: 22 },
];

export default function ContributionStatusChart() {
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              <XAxis dataKey="semaine" />
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
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Publiques" fill="#4caf50" />
              <Bar dataKey="Privées" fill="#ff9800" />
              <Bar dataKey="Archivées" fill="#f44336" />
            </BarChart>
          </ResponsiveContainer>
        }
      />
    </div>
  );
}

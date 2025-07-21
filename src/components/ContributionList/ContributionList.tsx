"use client";

import { Empty, List } from "antd";
import { Contribution, useContributions } from "@/hooks/useContributions";

import ContributionCard from "@/components/ContributionCard/ContributionCard";

type Props = {
  tab: "all" | "mine" | "public";
  onSelect: (item: Contribution) => void; // 🔸 nouveau
};

export default function ContributionsList({ tab, onSelect }: Props) {
  const { data } = useContributions();

  const filtered = data.filter((item) => {
    if (tab === "public") return item.visibility === "PUBLIC";
    if (tab === "mine") return item.author === "Toi-même";
    return true;
  });

  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={filtered}
      renderItem={(item) =>
        (
          <ContributionCard
            key={item.id}
            title={item.title}
            sector={item.sector}
            author={item.author}
            contactName="Julien Leclercq"
            contactRole="Directeur général"
            contactType="Prospect"
            summary="Un projet de restructuration important sur le campus Est. À relancer en septembre."
            qualification="Projet lancé"
            rdvDate="2025-06-27"
            createdAt={item.createdAt}
            visibility={item.visibility}
            remindAt="2025-07-03"
            onClick={() => {
              onSelect(item as Contribution);
            }}
          />
        ) as any
      }
    />
  );
}

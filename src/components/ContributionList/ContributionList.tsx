"use client";

import { List } from "antd";
import { useContributions } from "@/hooks/useContributions";
import type { Contribution } from "@/types/contribution";
import type { Filters } from "@/components/ContributionsFilters/ContributionsFilters";

import ContributionCard from "@/components/ContributionCard/ContributionCard";

type Props = {
  tab: "all" | "mine" | "public";
  filters: Filters;
  page: number;
  onPageChange: (page: number) => void;
  onSelect: (item: Contribution) => void;
};

export default function ContributionsList({ tab, filters, page, onPageChange, onSelect }: Props) {
  const { data } = useContributions(tab, { ...filters, page });

  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={data}
      pagination={{
        pageSize: 10,
        current: page,
        onChange: onPageChange,
        hideOnSinglePage: true,
      }}
      renderItem={(item) => (
        <ContributionCard
          key={item.id}
          title={item.title}
          sector={item.sector}
          author={item.author}
          contactName={item?.client?.name}
          contactRole={item?.client?.function}
          contactType={item?.client?.type}
          summary="Un projet de restructuration important sur le campus Est. À relancer en septembre."
          qualification={item?.qualification}
          rdvDate="2025-06-27"
          createdAt={item.createdAt}
          visibility={item.visibility}
          remindAt="2025-07-03"
          onClick={() => {
            onSelect(item);
          }}
        />
      )}
    />
  );
}

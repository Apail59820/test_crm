"use client";

import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import styles from "./ContributionsPage.module.scss";

import ContributionTabs from "@/components/ContributionTabs/ContributionTabs";
import ContributionsList from "@/components/ContributionList/ContributionList";
import ContributionsFilters, {
  type Filters,
} from "@/components/ContributionsFilters/ContributionsFilters";
import ContributionDrawer from "@/components/ContributionDrawer/ContributionDrawer";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import type { Contribution } from "@/types/contribution";
import NewContributionDrawer from "@/components/NewContributionDrawer/NewContributionDrawer";

export default function ContributionsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "mine" | "public">("all");
  const [selected, setSelected] = useState<Contribution | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);

  return (
    <div className={styles.container}>
      <PageHeader
        title="Contributions"
        subtitle="Suivi des échanges et projets"
      />

      <div className={styles.content}>
        <ContributionTabs
          activeTab={activeTab}
          onChangeTab={(tab) => { setPage(1); setActiveTab(tab); }}
          onCreate={() => setFormOpen(true)}
        />

        <ContributionsFilters value={filters} onChange={(f) => { setPage(1); setFilters(f); }} />
        <div className={styles.listWrapper}>
          <ContributionsList
            tab={activeTab}
            filters={filters}
            page={page}
            onPageChange={setPage}
            onSelect={setSelected}
          />
        </div>

        <FloatButton
          icon={<PlusOutlined />}
          type="primary"
          style={{ position: "fixed", bottom: 80, right: 24 }}
          onClick={() => setFormOpen(true)}
        />
      </div>

      <ContributionDrawer
        open={Boolean(selected)}
        data={selected ?? undefined}
        onClose={() => setSelected(null)}
      />

      <NewContributionDrawer
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={() => setFormOpen(false)}
      />
    </div>
  );
}

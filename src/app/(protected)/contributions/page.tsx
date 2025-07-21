"use client";

import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import styles from "./ContributionsPage.module.scss";

import ContributionTabs from "@/components/ContributionTabs/ContributionTabs";
import ContributionsList from "@/components/ContributionList/ContributionList";
import ContributionDrawer from "@/components/ContributionDrawer/ContributionDrawer";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import type { Contribution } from "@/types/contribution";
import NewContributionDrawer from "@/components/NewContributionDrawer/NewContributionDrawer";

export default function ContributionsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "mine" | "public">("all");
  const [selected, setSelected] = useState<Contribution | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className={styles.container}>
      <PageHeader
        title="Contributions"
        subtitle="Suivi des échanges et projets"
      />

      <div className={styles.content}>
        <ContributionTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        <div className={styles.listWrapper}>
          <ContributionsList tab={activeTab} onSelect={setSelected} />
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
        data={selected as never ?? undefined}
        onClose={() => setSelected(null)}
      />

      <NewContributionDrawer
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(values) => {
          console.log("POST vers API", values);
          // TODO: refetch SWR
        }}
      />
    </div>
  );
}

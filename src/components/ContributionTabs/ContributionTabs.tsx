"use client";

import { Tabs, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./ContributionTabs.module.scss";

type Props = {
  activeTab: "all" | "mine" | "public";
  onChangeTab: (key: "all" | "mine" | "public") => void;
  onCreate?: () => void;
};

export default function ContributionTabs({ activeTab, onChangeTab, onCreate }: Props) {
  return (
    <div className={styles.wrapper}>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => onChangeTab(key as "all" | "mine" | "public")}
        items={[
          { key: "all", label: "Toutes" },
          { key: "mine", label: "Mes contributions" },
          { key: "public", label: "Publiques" },
        ]}
      />

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreate}
        className={styles.createButton}
      >
        Nouvelle contribution
      </Button>
    </div>
  );
}

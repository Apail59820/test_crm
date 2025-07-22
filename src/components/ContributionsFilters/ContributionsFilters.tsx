"use client";

import { Input, Select, Space } from "antd";
import styles from "./ContributionsFilters.module.scss";

const sectors = [
  "Promoteur",
  "Constructeur",
  "Architecte",
  "Collectivités",
  "Entreprises",
  "Services",
  "Autre",
];

export type Filters = {
  search?: string;
  sector?: string;
  visibility?: string;
};

export default function ContributionsFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (val: Filters) => void;
}) {
  return (
    <Space className={styles.wrapper} wrap size="middle">
      <Input.Search
        allowClear
        placeholder="Rechercher…"
        value={value.search}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        style={{ maxWidth: 200 }}
      />
      <Select
        allowClear
        placeholder="Secteur"
        value={value.sector}
        onChange={(val) => onChange({ ...value, sector: val })}
        options={sectors.map((s) => ({ value: s, label: s }))}
        style={{ width: 160 }}
      />
      <Select
        allowClear
        placeholder="Visibilité"
        value={value.visibility}
        onChange={(val) => onChange({ ...value, visibility: val })}
        options={[
          { value: "PUBLIC", label: "Publique" },
          { value: "PRIVATE", label: "Privée" },
          { value: "ARCHIVED", label: "Archivée" },
        ]}
        style={{ width: 160 }}
      />
    </Space>
  );
}

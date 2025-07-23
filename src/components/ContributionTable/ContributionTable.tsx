"use client";

import { useState } from "react";
import { Table, Typography, Tag, Space, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined } from "@ant-design/icons";
import styles from "./ContributionTable.module.scss";

type Contribution = {
  id: string;
  organization: string;
  region: string;
  contributor: string;
  date: string;
  summary: string;
  visibility: "PUBLIC" | "PRIVATE" | "ARCHIVED";
  status: "pending_validation";
};

const mockData: Contribution[] = [
  {
    id: "1",
    organization: "Ville de Lille",
    region: "Hauts-de-France",
    contributor: "Alice Martin",
    date: "2025-07-15",
    summary: "Projet d’aménagement du centre-ville avec focus mobilité douce.",
    visibility: "PUBLIC",
    status: "pending_validation",
  },
  {
    id: "2",
    organization: "Eiffage Immobilier",
    region: "Île-de-France",
    contributor: "Thomas Durand",
    date: "2025-07-16",
    summary: "Rencontre avec le promoteur pour discuter d’un nouveau lotissement.",
    visibility: "PRIVATE",
    status: "pending_validation",
  },
  {
    id: "3",
    organization: "CCI Lyon",
    region: "Auvergne-Rhône-Alpes",
    contributor: "Julie Bernard",
    date: "2025-07-17",
    summary: "Échange sur les opportunités partenariales autour du pôle innovation.",
    visibility: "PUBLIC",
    status: "pending_validation",
  },
];

export default function ContributionTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    mockData.map((d) => d.id)
  );

  const columns: ColumnsType<Contribution> = [
    {
      title: "Entreprise / Collectivité",
      dataIndex: "organization",
      key: "organization",
      responsive: ["sm"],
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "Contributeur",
      dataIndex: "contributor",
      key: "contributor",
      responsive: ["md"],
    },
    {
      title: "Région",
      dataIndex: "region",
      key: "region",
      responsive: ["lg"],
    },
    {
      title: "Date RDV",
      dataIndex: "date",
      key: "date",
      render: (date) =>
        new Date(date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: "Résumé",
      dataIndex: "summary",
      key: "summary",
      ellipsis: true,
      render: (text) => (
        <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ rows: 2 }}>
          {text}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Visibilité",
      dataIndex: "visibility",
      key: "visibility",
      responsive: ["md"],
      render: (vis) => {
        const color = vis === "PUBLIC" ? "green" : vis === "PRIVATE" ? "orange" : "red";
        return <Tag color={color}>{vis}</Tag>;
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Contributions en attente de validation
        </Typography.Title>
        <Space size={'large'}>
          <Typography.Text type="secondary">
            {selectedRowKeys.length} sélectionnées
          </Typography.Text>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() => {
              console.log("Exporter : ", selectedRowKeys);
            }}
          >
            Exporter en Word
          </Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={mockData}
        rowSelection={rowSelection}
        pagination={{ pageSize: 5 }}
        className={styles.table}
      />
    </div>
  );
}

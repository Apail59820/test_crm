"use client";

import { useState, useEffect } from "react";
import { Table, Typography, Tag, Space, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined } from "@ant-design/icons";
import styles from "./ContributionTable.module.scss";

import type { NewsletterFilterValues } from "@/components/NewsletterFilters/NewsletterFilters";
import { useNewsletterContributions, type NewsletterContribution } from "@/hooks/useNewsletterContributions";

type Contribution = NewsletterContribution;

export default function ContributionTable({
  filters,
}: {
  filters: NewsletterFilterValues | null;
}) {
  const { data = [] } = useNewsletterContributions({
    startDate: filters?.range?.[0]?.toISOString(),
    endDate: filters?.range?.[1]?.toISOString(),
    userIds: filters && !filters.all ? filters.users : undefined,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    setSelectedRowKeys(data.map((d) => d.id));
  }, [data]);

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
        dataSource={data}
        rowSelection={rowSelection}
        pagination={{ pageSize: 5 }}
        className={styles.table}
      />
    </div>
  );
}

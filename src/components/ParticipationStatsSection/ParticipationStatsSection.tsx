"use client";

import { Table, Card, Typography, Tag, Space, Avatar, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import styles from "./ParticipationStatsSection.module.scss";

interface ContributorStats {
  id: string;
  name: string;
  avatar?: string;
  entity: string;
  region: string;
  hasContributed: boolean;
  contributionCount: number;
  lastContribution?: string;
}

const mockData: ContributorStats[] = [
  {
    id: "1",
    name: "Amaury Paillart",
    avatar: "https://i.pravatar.cc/150?img=1",
    entity: "Projex Lille",
    region: "Hauts-de-France",
    hasContributed: true,
    contributionCount: 3,
    lastContribution: "2025-07-23",
  },
  {
    id: "2",
    name: "Julie Martin",
    avatar: "https://i.pravatar.cc/150?img=2",
    entity: "Projex Lyon",
    region: "Auvergne-Rhône-Alpes",
    hasContributed: false,
    contributionCount: 0,
  },
  {
    id: "3",
    name: "Romain Lefebvre",
    avatar: "https://i.pravatar.cc/150?img=3",
    entity: "Projex Paris",
    region: "Île-de-France",
    hasContributed: true,
    contributionCount: 1,
    lastContribution: "2025-07-22",
  },
];

export default function ParticipationStatsSection() {
  const columns: ColumnsType<ContributorStats> = [
    {
      title: "Contributeur",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} alt={text} />
          <div>
            <Typography.Text strong>{text}</Typography.Text>
            <div className={styles.entity}>{record.entity}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Région",
      dataIndex: "region",
      key: "region",
      responsive: ["md"],
    },
    {
      title: "Participation",
      dataIndex: "hasContributed",
      key: "hasContributed",
      render: (value) =>
        value ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            A contribué
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="default">
            Pas de contribution
          </Tag>
        ),
    },
    {
      title: "Nombre de contributions",
      dataIndex: "contributionCount",
      key: "contributionCount",
      align: "center",
      responsive: ["md"],
    },
    {
      title: "Dernière contribution",
      dataIndex: "lastContribution",
      key: "lastContribution",
      responsive: ["lg"],
      render: (date) =>
        date ? (
          <Typography.Text>{new Date(date).toLocaleDateString("fr-FR")}</Typography.Text>
        ) : (
          <Typography.Text type="secondary">—</Typography.Text>
        ),
    },
    {
      title: "",
      key: "info",
      render: (_, record) =>
        record.hasContributed && (
          <Tooltip title="Voir les contributions">
            <InfoCircleOutlined className={styles.infoIcon} />
          </Tooltip>
        ),
      align: "center",
      responsive: ["xl"],
    },
  ];

  return (
    <Card className={styles.card} title="Statistiques de participation">
      <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Suivi des contributeurs pour la période sélectionnée. Données mises à jour en temps réel.
      </Typography.Paragraph>
      <Table
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        pagination={false}
        className={styles.table}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
}

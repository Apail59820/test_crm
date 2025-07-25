"use client";

import { Table, Card, Typography, Tag, Space, Avatar, Tooltip, DatePicker, Checkbox } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import styles from "./ParticipationStatsSection.module.scss";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/fr_FR";
import { useState } from "react";
import { useParticipationStats, type ParticipationStat } from "@/hooks/useParticipationStats";

const { RangePicker } = DatePicker;

export default function ParticipationStatsSection() {
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);
  const [allTime, setAllTime] = useState(false);

  const { data = [] } = useParticipationStats({
    startDate: allTime ? undefined : range[0]?.toISOString(),
    endDate: allTime ? undefined : range[1]?.toISOString(),
  });

  const columns: ColumnsType<ParticipationStat> = [
    {
      title: "Contributeur",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} alt={text} />
          <div>
            <Typography.Text strong>{text}</Typography.Text>
            {record.entity && <div className={styles.entity}>{record.entity}</div>}
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
      <div className={styles.header}>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          Suivi des contributeurs pour la période sélectionnée. Données mises à jour en temps réel.
        </Typography.Paragraph>
        <Space>
          <Checkbox checked={allTime} onChange={(e) => setAllTime(e.target.checked)}>
            Tout le temps
          </Checkbox>
          <RangePicker
            locale={locale}
            format="DD/MM/YYYY"
            allowClear={false}
            disabled={allTime}
            style={{ borderRadius: 6 }}
            className={styles.rangePicker}
            value={range}
            onChange={(values) => {
              if (values) setRange(values as [dayjs.Dayjs, dayjs.Dayjs]);
            }}
          />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        className={styles.table}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Card, Typography, DatePicker, Select, Button, Space, Divider, Tag, Spin, Empty } from "antd";
import { FilePdfOutlined, FileWordOutlined, MailOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import { useNewsletterContributions } from "@/hooks/useNewsletterContributions";
import styles from "./NewsletterBuilder.module.scss";

const { RangePicker } = DatePicker;


export default function NewsletterBuilder() {
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [exportType, setExportType] = useState<"pdf" | "word" | "email">("pdf");

  const { data = [], isLoading } = useNewsletterContributions({
    startDate: range?.[0]?.toISOString(),
    endDate: range?.[1]?.toISOString(),
    enabled: Boolean(range),
  });

  const tagColor = (v: string) => {
    return v === "PUBLIC" ? "green" : v === "PRIVATE" ? "orange" : "red";
  };

  return (
    <Card className={styles.container} variant={"borderless"}>
      <Typography.Title level={4} className={styles.title}>
        Création de la newsletter
      </Typography.Title>

      <Typography.Text type="secondary" className={styles.subtitle}>
        Sélectionnez une période pour récupérer les contributions correspondantes
      </Typography.Text>

      <Divider className={styles.divider} />

      <Space direction="vertical" size="large" className={styles.controls}>
        <div className={styles.row}>
          <div className={styles.label}>Période à inclure</div>
          <RangePicker onChange={(dates) => setRange(dates as [Dayjs, Dayjs])} />
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Format d’export</div>
          <Select
            value={exportType}
            onChange={(value) => setExportType(value)}
            style={{ width: 200 }}
            options={[
              { label: "PDF", value: "pdf" },
              { label: "Word", value: "word" },
              { label: "Email", value: "email" },
            ]}
          />
        </div>
      </Space>

      <Divider />

      <Typography.Title level={5}>Aperçu des contributions à inclure</Typography.Title>

      <div className={styles.previewContainer}>
        {isLoading && <Spin />}
        {!isLoading && data.length === 0 && (
          <Empty description="Aucune contribution" />
        )}
        {!isLoading &&
          data.map((item) => (
            <div className={styles.previewRow} key={item.id}>
              <div className={styles.previewMeta}>
                <Typography.Text strong className={styles.org}>
                  {item.organization}
                </Typography.Text>
                <Typography.Text type="secondary" className={styles.meta}>
                  {item.contributor} — {item.region}
                </Typography.Text>
                <Tag color={tagColor(item.visibility)} className={styles.tag}>
                  {item.visibility}
                </Tag>
              </div>

              <div className={styles.previewSummary}>
                <Typography.Text ellipsis={{ tooltip: item.summary }}>
                  {item.summary}
                </Typography.Text>
              </div>
            </div>
          ))}
      </div>

      <div className={styles.footer}>
        <Button
          type="primary"
          icon={
            exportType === "pdf" ? (
              <FilePdfOutlined />
            ) : exportType === "word" ? (
              <FileWordOutlined />
            ) : (
              <MailOutlined />
            )
          }
          size="large"
          disabled={!range}
          onClick={() => console.log("Export initiated")}
        >
          Exporter la newsletter
        </Button>
      </div>
    </Card>
  );
}

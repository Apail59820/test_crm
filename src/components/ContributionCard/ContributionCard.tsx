// app/contributions/components/ContributionCardV2.tsx
"use client";

import { Avatar, Badge, Tag, Tooltip, Typography } from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import styles from "./ContributionCard.module.scss";

type Props = {
  title: string;
  sector: string;
  author: string;
  contactName?: string;
  contactRole?: string;
  contactType?: string;
  createdAt: string;
  rdvDate?: string;
  summary?: string;
  qualification?: string;
  visibility: "PUBLIC" | "PRIVATE" | "ARCHIVED";
  remindAt?: string;
  onClick?: () => void;
};

export default function ContributionCard({
  title,
  sector,
  author,
  contactName,
  contactRole,
  contactType,
  createdAt,
  rdvDate,
  summary,
  qualification,
  visibility,
  remindAt,
  onClick,
}: Props) {
  const colorMap = {
    PUBLIC: "green",
    PRIVATE: "orange",
    ARCHIVED: "red",
  };

  const qualificationColor =
    qualification === "Projet lancé"
      ? "green"
      : qualification === "À confirmer"
        ? "orange"
        : "default";

  const showReminder =
    remindAt &&
    new Date(remindAt).getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      className={styles.cardWrapper}
      onClick={onClick}
    >
      <div className={styles.cardHeader}>
        <div className={styles.titleGroup}>
          <Typography.Title level={5} className={styles.title}>
            {title}
          </Typography.Title>
          <Tag className={styles.status} color={colorMap[visibility]}>
            {visibility}
          </Tag>
        </div>
        {showReminder && (
          <Tooltip title="Rappel à venir">
            <Badge status="error" />
          </Tooltip>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.row}>
          <Typography.Text type="secondary">{sector}</Typography.Text>
          {contactType && <Tag>{contactType}</Tag>}
          {qualification && (
            <Tag color={qualificationColor}>{qualification}</Tag>
          )}
        </div>

        {summary && (
          <Typography.Paragraph
            className={styles.summary}
            ellipsis={{ rows: 2 }}
          >
            {summary}
          </Typography.Paragraph>
        )}

        <div className={styles.metaRow}>
          <div className={styles.contactInfo}>
            <Avatar icon={(<UserOutlined />) as any} size="small" />
            <Typography.Text className={styles.contactText}>
              {contactName}
              {contactRole ? ` (${contactRole})` : ""}
            </Typography.Text>
          </div>

          <div className={styles.metaInfo}>
            {rdvDate && (
              <div className={styles.metaItem}>
                <CalendarOutlined style={{ marginRight: 4 }} />
                {new Date(rdvDate).toLocaleDateString()}
              </div>
            )}
            <div className={styles.metaItem}>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {new Date(createdAt).toLocaleDateString()}
            </div>
            <Typography.Text type="secondary" className={styles.author}>
              par {author}
            </Typography.Text>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

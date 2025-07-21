"use client";

import {
  Drawer,
  Typography,
  Space,
  Divider,
  Tag,
  Button,
  Descriptions,
  Tooltip,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import styles from "./ContributionDrawer.module.scss";

type Props = {
  open: boolean;
  onClose: () => void;
  data: {
    id: string;
    title: string;
    sector: string;
    author: string;
    contactName: string;
    contactRole?: string;
    contactType?: string;
    rdvDate?: string;
    createdAt: string;
    summary?: string;
    qualification?: string;
    visibility: "PUBLIC" | "PRIVATE" | "ARCHIVED";
  };
};

export default function ContributionDrawer({ open, onClose, data }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      onClose();
      setLoading(false);
    }, 1000);
  };

  if (!data) return <Drawer open={open} onClose={onClose} />;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={580}
      className={styles.drawer}
      styles={{ body: { padding: 24 } }}
      title={
        <div className={styles.header}>
          <Typography.Title level={4} className={styles.title}>
            {data.title}
          </Typography.Title>
          <Space>
            <Tooltip title="Modifier">
              <Button
                icon={(<EditOutlined />) as any}
                type="default"
                size="small"
                onClick={() => console.log("open edit")}
              />
            </Tooltip>
            <Tooltip title="Archiver">
              <Button
                icon={(<DeleteOutlined />) as any}
                type="text"
                danger
                size="small"
                loading={loading}
                onClick={handleDelete}
              />
            </Tooltip>
          </Space>
        </div>
      }
    >
      <div className={styles.content}>
        <Descriptions
          column={1}
          size="small"
          layout="vertical"
          styles={{ label: { fontWeight: 500 } }}
        >
          <Descriptions.Item label="Secteur">{data.sector}</Descriptions.Item>
          <Descriptions.Item label="Type de contact">
            {data.contactType || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Nom du contact">
            {data.contactName} {data.contactRole && `(${data.contactRole})`}
          </Descriptions.Item>
          <Descriptions.Item label="Qualification du projet">
            {data.qualification || "Non précisé"}
          </Descriptions.Item>
          <Descriptions.Item label="Date du rendez-vous">
            {data.rdvDate ? new Date(data.rdvDate).toLocaleDateString() : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Créée le">
            {new Date(data.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Créée par">{data.author}</Descriptions.Item>
          <Descriptions.Item label="Visibilité">
            <Tag
              color={
                data.visibility === "PUBLIC"
                  ? "green"
                  : data.visibility === "PRIVATE"
                    ? "orange"
                    : "red"
              }
            >
              {data.visibility}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {data.summary && (
          <>
            <Divider />
            <Typography.Paragraph className={styles.summary}>
              {data.summary}
            </Typography.Paragraph>
          </>
        )}
      </div>
    </Drawer>
  );
}

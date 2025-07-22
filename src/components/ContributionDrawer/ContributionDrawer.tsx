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
import { useEffect, useState } from "react";
import { readItems, updateItem } from "@directus/sdk";
import styles from "./ContributionDrawer.module.scss";

import type { Contribution, Visibility } from "@/types/contribution";
import { directus } from "@/lib/directus";
import ContributionEditDrawer from "@/components/ContributionEditDrawer/ContributionEditDrawer";

type Props = {
  open: boolean;
  onClose: () => void;
  data?: Contribution & {
    contactName?: string;
    contactRole?: string;
    contactType?: string;
    rdvDate?: string;
    summary?: string;
    qualification?: string;
  };
};

const visibilityColor: Record<Visibility, string> = {
  PUBLIC: "green",
  PRIVATE: "orange",
  ARCHIVED: "red",
};

export default function ContributionDrawer({ open, onClose, data }: Props) {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleDelete = () => {
    if (!data) return;
    setLoading(true);
    (async () => {
      try {
        const status = await directus.request<{ id: string }[]>(
          readItems("contributions_status", {
            fields: ["id"],
            filter: { label: { _eq: "ARCHIVED" } },
            limit: 1,
          }),
        );
        const statusId = status[0]?.id;
        await directus.request(
          updateItem("contributions", data.id, { status: statusId }),
        );
        onClose();
      } catch (err) {
        console.error("archive error", err);
      } finally {
        setLoading(false);
      }
    })();
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (!data) return <Drawer open={open} onClose={onClose} />;

  return (
    <>
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
                icon={<EditOutlined />}
                type="default"
                size="small"
                onClick={() => setEdit(true)}
              />
            </Tooltip>
            <Tooltip title="Archiver">
              <Button
                icon={<DeleteOutlined />}
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
            {data.client?.type || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Nom du contact">
            {data.client?.name} {data.client?.name && `(${data.client?.function})`}
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
            <Tag color={visibilityColor[data.visibility]}>{data.visibility}</Tag>
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
    <ContributionEditDrawer open={edit} onClose={() => setEdit(false)} id={data.id} />
    </>
  );
}

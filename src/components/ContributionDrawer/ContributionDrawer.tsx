"use client";

import {
  Drawer,
  Typography,
  Space,
  Divider,
  Tag,
  Button,
  Tooltip,
  Grid,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  UserOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { readItems, updateItem } from "@directus/sdk";
import styles from "./ContributionDrawer.module.scss";

import type { Contribution, Visibility } from "@/types/contribution";
import { directus } from "@/lib/directus";
import ContributionEditDrawer from "@/components/ContributionEditDrawer/ContributionEditDrawer";

const { useBreakpoint } = Grid;

const visibilityColor: Record<Visibility, string> = {
  PUBLIC: "green",
  PRIVATE: "orange",
  ARCHIVED: "red",
};

export default function ContributionDrawer({ open, onClose, data }: Props) {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const screens = useBreakpoint();

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

  if (!data) return <Drawer open={open} onClose={onClose} />;

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        width={screens.md ? 700 : "100%"}
        className={styles.drawer}
        styles={{ body: { padding: 32 } }}
        title={
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Typography.Title level={4} className={styles.title}>
                {data.title}
              </Typography.Title>
              <div className={styles.subline}>
                <Typography.Text type="secondary">
                  {data.sector || "—"} • {data.client?.type || "—"}
                </Typography.Text>
              </div>
            </div>
            <Space>
              <Tag color={visibilityColor[data.visibility]}>
                {data.visibility}
              </Tag>
              <Tooltip title="Modifier">
                <Button icon={<EditOutlined />} onClick={() => setEdit(true)} />
              </Tooltip>
              <Tooltip title="Archiver">
                <Button
                  icon={<DeleteOutlined />}
                  type="text"
                  danger
                  loading={loading}
                  onClick={handleDelete}
                />
              </Tooltip>
            </Space>
          </div>
        }
      >
        <div className={styles.content}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Typography.Text type="secondary">
                <ApartmentOutlined /> Secteur
              </Typography.Text>
              <div>{data.sector || "—"}</div>
            </Col>

            <Col xs={24} md={12}>
              <Typography.Text type="secondary">
                <UserOutlined /> Contact
              </Typography.Text>
              <div>
                {data.client?.name}{" "}
                {data.client?.function && `(${data.client.function})`}
              </div>
            </Col>

            <Col xs={24} md={12}>
              <Typography.Text type="secondary">Qualification</Typography.Text>
              <div>{data.qualification || "—"}</div>
            </Col>

            <Col xs={24} md={12}>
              <Typography.Text type="secondary">
                <CalendarOutlined /> Rendez-vous
              </Typography.Text>
              <div>
                {data.rdvDate
                  ? new Date(data.rdvDate).toLocaleDateString()
                  : "—"}
              </div>
            </Col>

            <Col xs={24} md={12}>
              <Typography.Text type="secondary">Créé le</Typography.Text>
              <div>{new Date(data.createdAt).toLocaleDateString()}</div>
            </Col>

            <Col xs={24} md={12}>
              <Typography.Text type="secondary">Auteur</Typography.Text>
              <div>{data.author}</div>
            </Col>
          </Row>

          {data.summary && (
            <>
              <Divider className={styles.divider} />
              <Typography.Title level={5}>Compte-rendu</Typography.Title>
              <Typography.Paragraph className={styles.summary}>
                {data.summary}
              </Typography.Paragraph>
            </>
          )}
        </div>
      </Drawer>
      {edit && (
        <ContributionEditDrawer
          id={data.id}
          open={edit}
          onClose={() => setEdit(false)}
          defaultValues={{
            summary: data.summary,
            projectQualification: data.qualification,
            visibility: data.visibility,
          }}
        />
      )}
    </>
  );
}

interface Props {
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
}

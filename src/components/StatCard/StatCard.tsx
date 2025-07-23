import { Card, Typography, Divider } from "antd";
import React from "react";

export function StatCard({
  title,
  subtitle,
  content,
}: {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}) {
  return (
    <Card
      variant={"borderless"}
      style={{ borderRadius: 12 }}
      styles={{ body: { padding: 20 } }}
    >
      <Typography.Title level={5} style={{ margin: 0 }}>
        {title}
      </Typography.Title>

      {subtitle && (
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {subtitle}
        </Typography.Text>
      )}

      <Divider style={{ margin: "12px 0" }} />

      <div>{content}</div>
    </Card>
  );
}

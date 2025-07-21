"use client";

import React from "react";
import { Spin, Skeleton, Flex, Row, Col, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

// Spinner principal (grande icône animée Ant Design)
const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

/**
 * FullPageLoader – écran d'attente plein écran.
 * • Ant Design v5 : Spin, Skeleton, Flex
 * • Framer Motion : fondu d'apparition/disparition
 */
export default function FullPageLoader() {
  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "var(--color-bg-elevated, #ffffff)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Flex
          vertical
          align="center"
          justify="center"
          style={{ height: "100%", paddingInline: 24 }}
          gap={32}
        >
          <Spin indicator={antIcon} size="large" />

          <Typography.Title
            level={4}
            style={{ margin: 0, textAlign: "center" }}
          >
            Chargement de votre espace…
          </Typography.Title>

          <Row gutter={[24, 24]} style={{ maxWidth: 720, width: "100%" }}>
            {[1, 2].map((col) => (
              <Col key={col} xs={24} sm={12}>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Col>
            ))}
          </Row>
        </Flex>
      </motion.div>
    </AnimatePresence>
  );
}

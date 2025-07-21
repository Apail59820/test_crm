// PageHeader.tsx
"use client";

import { Typography } from "antd";
import styles from "./PageHeader.module.scss";
import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={styles.header}
    >
      <div className={styles.header}>
        <Typography.Title level={2} className={styles.title}>
          {title}
        </Typography.Title>
        {subtitle && (
          <Typography.Paragraph className={styles.subtitle}>
            {subtitle}
          </Typography.Paragraph>
        )}
      </div>
    </motion.div>
  );
}

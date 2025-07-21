"use client";

import { Row, Col, Typography } from "antd";
import { motion } from "framer-motion";
import { PenLine, UserCog, FileText, SendHorizontal } from "lucide-react";
import styles from "./HowItWorks.module.scss";
import React from "react";

const { Title, Paragraph } = Typography;

const steps = [
  {
    icon: <PenLine size={28} strokeWidth={2.2} />,
    title: "Je saisis un événement",
    desc: "Depuis mobile ou desktop, en quelques clics.",
    color: "var(--color-primary)",
  },
  {
    icon: <UserCog size={28} strokeWidth={2.2} />,
    title: "Le valideur édite",
    desc: "Il corrige, censure ou regroupe si besoin.",
    color: "var(--color-accent)",
  },
  {
    icon: <FileText size={28} strokeWidth={2.2} />,
    title: "Génération PDF",
    desc: "Une synthèse claire et prête à diffuser.",
    color: "var(--color-primary)",
  },
  {
    icon: <SendHorizontal size={28} strokeWidth={2.2} />,
    title: "Envoi Teams / Outlook",
    desc: "La newsletter est automatiquement diffusée.",
    color: "var(--color-accent)",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.how}>
      <div className={styles.container}>
        <Title level={2} className={styles.title}>
          Comment <span className={styles.accent}>ça marche&nbsp;?</span>
        </Title>
        <Paragraph className={styles.subtitle}>
          En 4 étapes simples, du terrain à la diffusion automatique.
        </Paragraph>

        <Row gutter={[32, 32]} justify="center">
          {
            steps.map((step, idx) => (
              <Col xs={24} sm={12} lg={6} key={step.title}>
                <motion.div
                  className={styles.card}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                >
                  <div
                    className={styles.iconWrap}
                    style={{ color: step.color }}
                  >
                    {step.icon}
                  </div>
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <p className={styles.cardDesc}>{step.desc}</p>
                </motion.div>
              </Col>
            )) as React.ReactNode
          }
        </Row>
      </div>
    </section>
  );
}

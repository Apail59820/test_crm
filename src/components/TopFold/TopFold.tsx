"use client";

/* --------------------------------------------------
   TopFold.tsx – Hero ultra-premium avec halos animés
   -------------------------------------------------- */

import { Typography, Button } from "antd";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import styles from "./TopFold.module.scss";

const { Title, Paragraph } = Typography;

const haloVariants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear",
      duration: 120,
    },
  },
};

export default function TopFold() {
  return (
    <section className={styles.hero}>
      <motion.svg
        className={styles.decorMain}
        viewBox="0 0 600 600"
        variants={haloVariants as Variants}
        initial="initial"
        animate="animate"
        aria-hidden
      >
        <defs>
          <linearGradient id="gradMain" x1="0" y1="0" x2="1" y2="1">
            <stop
              offset="0"
              stopColor="var(--color-primary)"
              stopOpacity="0.08"
            />
            <stop
              offset="1"
              stopColor="var(--color-accent)"
              stopOpacity="0.05"
            />
          </linearGradient>
        </defs>
        <circle cx="300" cy="300" r="300" fill="url(#gradMain)" />
      </motion.svg>

      {/* Halo secondaire (coin bas gauche) */}
      <motion.svg
        className={styles.decorAlt}
        viewBox="0 0 400 400"
        variants={haloVariants as Variants}
        initial="initial"
        animate="animate"
        aria-hidden
      >
        <defs>
          <radialGradient id="gradAlt" cx="0.3" cy="0.3" r="0.7">
            <stop
              offset="0"
              stopColor="var(--color-accent)"
              stopOpacity="0.07"
            />
            <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="200" fill="url(#gradAlt)" />
      </motion.svg>

      {/* Contenu principal (texte + illustration) */}
      <div className={styles.container}>
        {/* Bloc texte + CTA */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={styles.text}
        >
          <Title className={styles.title}>
            Le seul <span className={styles.highlight}>CRM</span>
            <br />
            qui tient en une newsletter
          </Title>

          <Paragraph className={styles.desc}>
            Saisie simplifiée • PDF instantané • Pensé pour les chefs de projet.
          </Paragraph>

          <Button size="large" shape="round" className={styles.cta}>
            Commencer maintenant
          </Button>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className={styles.illustration}
        >
          <Image
            src="/top-fold-illustration.png"
            alt="Illustration du mini-CRM"
            width={520}
            height={420}
            priority
          />
        </motion.div>
      </div>
      <div className={styles.wave}>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path
            d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z"
            fill="#fff"
          />
        </svg>
      </div>
    </section>
  );
}

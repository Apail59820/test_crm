"use client";

/*
 * Corporate Footer – Groupe Projex mini-CRM
 * Next 15 – Ant Design 5 – SCSS modules
 */
import React from "react";
import Link from "next/link";
import {
  MailOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";

import styles from "./Footer.module.scss";

const appVersion = "v1.0.0";
const buildDate = "25 juin 2025";

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      {/* Identity + baseline */}
      <div className={styles.brand}>
        <div className={styles.logo}>Projex&nbsp;CRM</div>
        <p className={styles.baseline}>
          Outil interne développé par l’équipe digitale du Groupe Projex.
        </p>
      </div>

      {/* Links */}
      <nav className={styles.links} aria-label="Liens légaux et docs">
        <Link href="/legal" className={styles.link}>
          <FileProtectOutlined /> Mentions légales
        </Link>
        <Link href="/rgpd" className={styles.link}>
          <FileTextOutlined /> Politique RGPD
        </Link>
        <Link href="/guide" className={styles.link}>
          <InfoCircleOutlined /> Guide utilisateur
        </Link>
        <Link href="/changelog" className={styles.link}>
          <CloudServerOutlined /> Changelog
        </Link>
      </nav>

      {/* Contact */}
      <address className={styles.contact}>
        <a
          href="mailto:support@groupe-projex.fr"
          className={styles.contactLink}
        >
          <MailOutlined /> support@groupe-projex.fr
        </a>
        <span className={styles.resp}>
          Responsable produit : <strong>Paillart Amaury</strong>
        </span>
      </address>
    </div>

    {/* bottom bar */}
    <div className={styles.bottomBar}>
      <span>
        © {new Date().getFullYear()} Groupe Projex – Tous droits réservés.
      </span>
      <span>
        {appVersion} · build {buildDate} · Hébergé sur Google Cloud Platform ·
        Données chiffrées
      </span>
    </div>
  </footer>
);

export default Footer;

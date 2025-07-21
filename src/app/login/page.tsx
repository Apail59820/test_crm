"use client";

import Image from "next/image";
import Link from "next/link";
import { Input, Button, Typography } from "antd";
import { WindowsOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import styles from "./login.module.scss";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { App } from "antd";
import React, { useState } from "react";

export default function LoginPage() {
  const slideLeft = {
    hidden: { x: -60, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };
  const slideRight = {
    hidden: { x: 60, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };
  const fadeUp = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { message } = App.useApp();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const me = (await login(email, password)) as {
        first_name: string;
        last_name: string;
        email: string;
      };

      const fullName =
        [me.first_name, me.last_name].filter(Boolean).join(" ") || me.email;

      message.success(`Bienvenue ${fullName} !`);

      router.replace("/");
    } catch {
      message.error("Identifiants invalides ou serveur indisponible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className={styles.container}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.15 }}
    >
      <motion.section
        className={styles.left}
        variants={slideLeft}
        transition={{ type: "spring", stiffness: 90, damping: 15 }}
      >
        <Image
          src="/logo.png"
          alt="Logo Projex"
          width={140}
          height={48}
          priority
        />

        <motion.div variants={fadeUp} className={styles.textBlock}>
          <Typography.Title level={2}>
            Bienvenue sur <br /> Projex&nbsp;CRM
          </Typography.Title>
          <Typography.Paragraph>
            Gérez vos contributions, automatisez vos newsletters et pilotez vos
            actions.
          </Typography.Paragraph>
        </motion.div>

        <motion.div variants={fadeUp} className={styles.illustration}>
          <Image
            src="/login-illustration.png"
            alt="Illustration CRM"
            width={320}
            height={320}
          />
        </motion.div>

        <motion.p variants={fadeUp} className={styles.signupHint}>
          Vous n&apos;avez pas encore de compte ?{" "}
          <Link href="/signup">Créer un compte</Link>
        </motion.p>
      </motion.section>

      <motion.section
        className={styles.right}
        variants={slideRight}
        transition={{ type: "spring", stiffness: 90, damping: 15 }}
      >
        <motion.form
          className={styles.formWrapper}
          variants={fadeUp}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
        >
          <Typography.Title level={3} className={styles.formTitle}>
            Connexion
          </Typography.Title>

          <Input
            placeholder="Adresse email"
            size="large"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input.Password
            placeholder="Mot de passe"
            size="large"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
              loading={loading}
              style={{ marginTop: "1.2rem" }}
            >
              Se connecter
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              icon={(<WindowsOutlined />) as React.ReactNode}
              size="large"
              block
              className={styles.ssoButton}
            >
              Se connecter avec Microsoft
            </Button>
          </motion.div>
        </motion.form>
      </motion.section>
    </motion.div>
  );
}

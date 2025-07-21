"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BellOutlined, UserOutlined, MenuOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Drawer, Grid, MenuProps, App } from "antd";
import styles from "./TopBar.module.scss";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const { useBreakpoint } = Grid;

const TopBar = () => {
  /* ─────────── State Drawer mobile ─────────── */
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);

  /* ─────────── Breakpoint AntD ─────────── */
  const screens = useBreakpoint();
  const isMobile = !screens.md; // < 768 px

  const { logout } = useAuth();
  const router = useRouter();
  const { message } = App.useApp();

  /* ─────────── Menu user ─────────── */
  const userMenuItems: MenuProps["items"] = [
    { key: "settings", label: "Paramètres" },
    { type: "divider", key: "user_divider" },
    { key: "logout", label: "Déconnexion" },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "logout") {
      try {
        await logout();
        message.success("Déconnecté !");
        router.replace("/login");
      } catch {
        message.error("Déconnexion impossible");
      }
    }
  };

  return (
    <header className={styles.topbar}>
      {/* ── Col gauche ───────────────────────── */}
      <div className={styles.left}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="Logo" fill priority onClick={() => {
            router.replace("/");
          }}/>
        </div>

        {/* Menu desktop uniquement */}
        {!isMobile && (
          <nav className={styles.nav}>
            <Link href="/contributions">Contributions</Link>
            <Link href="/newsletter">Newsletter</Link>
          </nav>
        )}
      </div>

      {/* ── Col droite ───────────────────────── */}
      <div className={styles.right}>
        {/* Burger mobile */}
        {isMobile && (
          <MenuOutlined
            className={styles.burger}
            onClick={toggleDrawer}
            aria-label="Ouvrir le menu"
          />
        )}

        <Badge count={5} size="small">
          <BellOutlined className={styles.icon} aria-label="Notifications" />
        </Badge>

        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          placement="bottomRight"
        >
          <div className={styles.avatar} aria-label="Menu utilisateur">
            <UserOutlined />
          </div>
        </Dropdown>
      </div>

      {/* ── Drawer mobile ─────────────────────── */}
      <Drawer
        title="Menu"
        placement="left"
        width={220}
        onClose={toggleDrawer}
        open={open}
        styles={{ body: { padding: 0 } }}
      >
        <nav className={styles.drawerNav}>
          <Link href="/contributions" onClick={toggleDrawer}>
            Contributions
          </Link>
          <Link href="/newsletter" onClick={toggleDrawer}>
            Newsletter
          </Link>
        </nav>
      </Drawer>
    </header>
  );
};

export default TopBar;

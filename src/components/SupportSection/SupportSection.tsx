"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import Image from "next/image";

import styles from "./SupportSection.module.scss";

const SupportSection: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.3 },
    );
    if (ref.current) {
      observer.observe(ref.current as Element);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`${styles.supportSection} ${isVisible ? styles.visible : ""}`}
    >
      <div className={styles.container}>
        <div className={styles.imageBlock}>
          <Image
            src={"/support-illustration.png"}
            alt="Illustration support"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className={styles.illustration}
            priority
          />
        </div>

        <div className={styles.textBlock}>
          <h2 className={styles.title}>
            Une question&nbsp;<span>?</span>
          </h2>
          <p className={styles.subtitle}>
            Le support est là pour vous aider. Une idée, une remarque, ou un
            bug&nbsp;? On vous répond.
          </p>
          <Button
            type="primary"
            size="large"
            icon={<MailOutlined />}
            href="mailto:support@groupe-projex.fr"
            className={styles.supportBtn}
          >
            Contacter le support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;

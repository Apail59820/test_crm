"use client";

import { DatePicker, Select, Button, Card, Form } from "antd";
import { motion } from "framer-motion";
import { Calendar, UserRoundSearch, Search } from "lucide-react";
import styles from "./NewsletterFilters.module.scss";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import locale from "antd/es/date-picker/locale/fr_FR";

dayjs.locale("fr");

const { RangePicker } = DatePicker;

export default function NewsletterFilters() {
  const defaultRange = [dayjs().subtract(7, "day"), dayjs()];

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={styles.card} variant={"borderless"}>
        <Form layout="vertical" className={styles.form} initialValues={{
          range: defaultRange,
        }}>
          <Form.Item
            label={
              <span className={styles.label}>
                <Calendar size={16} className={styles.icon} />
                Période
              </span>
            }
            name="range"
          >
            <RangePicker
              className={styles.range}
              locale={locale}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className={styles.label}>
                <UserRoundSearch size={16} className={styles.icon} />
                Contributeur
              </span>
            }
            name="user"
          >
            <Select
              placeholder="Tous les contributeurs"
              options={[
                { value: "all", label: "Tous les contributeurs" },
                { value: "user1", label: "Jean Dupont" },
                { value: "user2", label: "Marie Leclerc" },
              ]}
              className={styles.select}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              icon={<Search size={16} />}
              className={styles.searchButton}
              size="middle"
            >
              Rechercher
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </motion.div>
  );
}

"use client";

import { DatePicker, Select, Button, Card, Form, Checkbox, Spin, Empty } from "antd";
import { motion } from "framer-motion";
import { Calendar, UserRoundSearch, Search } from "lucide-react";
import { useState } from "react";
import styles from "./NewsletterFilters.module.scss";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import locale from "antd/es/date-picker/locale/fr_FR";
import { useUsers } from "@/hooks/useUsers";

dayjs.locale("fr");

const { RangePicker } = DatePicker;

export default function NewsletterFilters() {
  const [form] = Form.useForm();
  const defaultRange = [dayjs().subtract(7, "day"), dayjs()];
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading } = useUsers(search);
  const allContributors = Form.useWatch("all", form);

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={styles.card} variant={"borderless"}>
        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          initialValues={{
            range: defaultRange,
            all: true,
          }}
        >
          <Form.Item
            label={
              <span className={styles.label}>
                <Calendar size={16} className={styles.icon} />
                Période
              </span>
            }
            name="range"
          >
            <RangePicker className={styles.range} locale={locale} />
          </Form.Item>

          <Form.Item
            label={
              <span className={styles.label}>
                <UserRoundSearch size={16} className={styles.icon} />
                Contributeur
              </span>
            }
            name="users"
          >
            <Select
              mode="multiple"
              showSearch
              placeholder="Sélectionner…"
              className={styles.select}
              disabled={allContributors}
              onSearch={setSearch}
              filterOption={false}
              notFoundContent={isLoading ? <Spin size="small" /> : <Empty description="Aucun résultat" />}
              options={users.map((u) => ({
                value: u.id,
                label: [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email,
              }))}
            />
          </Form.Item>

          <Form.Item name="all" valuePropName="checked">
            <Checkbox>Tous les contributeurs</Checkbox>
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

"use client";

import {
  Drawer,
  Form,
  Select,
  Button,
  Typography,
  Space,
  Divider,
  DatePicker,
} from "antd";
import {
  Star,
  Eye,
  StickyNote,
  CalendarClock,
  CalendarDays,
} from "lucide-react";
import { useEffect } from "react";
import dayjs from "dayjs";
import styles from "./ContributionEditDrawer.module.scss";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Extension } from "@tiptap/core";
import TiptapMenuBar from "@/components/TipTapMenuBar/TipTapMenuBar";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultValues?: {
    summary?: string;
    projectQualification?: string;
    visibility?: "PUBLIC" | "PRIVATE" | "ARCHIVED";
    rdvDate?: string;
    reminderDate?: string;
  };
  onSubmit?: (values: Record<string, unknown>) => void;
};

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            renderHTML: ({ fontSize }: { fontSize: string }) =>
              fontSize ? { style: `font-size:${fontSize}` } : {},
            parseHTML: (el: HTMLElement) => ({
              fontSize: el.style.fontSize || null,
            }),
          },
        },
      },
    ] as any;
  },
});

export default function ContributionEditDrawer({
  open,
  onClose,
  defaultValues,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      Highlight,
      FontSize,
    ],
    content: defaultValues?.summary || "",
    editorProps: {
      attributes: { class: "tiptap-content" },
    },
  });

  useEffect(() => {
    if (defaultValues && editor) {
      editor.commands.setContent(defaultValues.summary || "");

      form.setFieldsValue({
        ...defaultValues,
        rdvDate: defaultValues.rdvDate ? dayjs(defaultValues.rdvDate) : null,
        reminderDate: defaultValues.reminderDate
          ? dayjs(defaultValues.reminderDate)
          : null,
      });
    }
  }, [defaultValues, editor, form]);

  const handleClose = () => {
    form.resetFields();
    editor?.commands.clearContent();
    onClose();
  };

  const handleSave = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    onSubmit?.({
      ...values,
      summary: editor?.getHTML() || "",
      rdvDate: values.rdvDate?.toISOString() || null,
      reminderDate: values.reminderDate?.toISOString() || null,
    });
    handleClose();
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      width={520}
      className={styles.drawer}
      destroyOnClose
      title={
        <div className={styles.header}>
          <Typography.Title level={4} className={styles.title}>
            Modifier la contribution
          </Typography.Title>
        </div>
      }
    >
      <Form form={form} layout="vertical" className={styles.form}>
        <Form.Item
          label={
            <span>
              <StickyNote className={styles.icon} /> Compte-rendu
            </span>
          }
          required
        >
          {editor && (
            <>
              <TiptapMenuBar editor={editor} />
              <div className={styles.tiptapEditor}>
                <EditorContent editor={editor} />
              </div>
            </>
          )}
        </Form.Item>

        <Form.Item
          name="projectQualification"
          label={
            <span>
              <Star className={styles.icon} /> Qualification du projet
            </span>
          }
        >
          <Select placeholder="Sélectionner une qualification…" />
        </Form.Item>

        <Form.Item
          name="rdvDate"
          label={
            <span>
              <CalendarDays className={styles.icon} /> Date du rendez-vous
            </span>
          }
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder="Sélectionner une date"
          />
        </Form.Item>

        <Form.Item
          name="reminderDate"
          label={
            <span>
              <CalendarClock className={styles.icon} /> Date de rappel
            </span>
          }
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder="Sélectionner une date"
          />
        </Form.Item>

        <Form.Item
          name="visibility"
          label={
            <span>
              <Eye className={styles.icon} /> Visibilité
            </span>
          }
        >
          <Select
            options={[
              { value: "PUBLIC", label: "Publique" },
              { value: "PRIVATE", label: "Privée" },
              { value: "ARCHIVED", label: "Archivée" },
            ]}
            style={{ maxWidth: 200 }}
          />
        </Form.Item>

        <Divider />
        <div className={styles.footer}>
          <Space>
            <Button onClick={handleClose}>Annuler</Button>
            <Button type="primary" onClick={handleSave}>
              Enregistrer
            </Button>
          </Space>
        </div>
      </Form>
    </Drawer>
  );
}

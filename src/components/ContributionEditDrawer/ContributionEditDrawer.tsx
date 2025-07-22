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
  App,
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

import { useProjectQualifs } from "@/hooks/useProjectQualifs";
import { useUpdateContribution } from "@/hooks/useUpdateContribution";
import { useContributionStatuses } from "@/hooks/useContributionStatuses";
import { useContribution } from "@/hooks/useContribution";

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
  id: string;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any;
  },
});

export default function ContributionEditDrawer({
  id,
  open,
  onClose,
  defaultValues,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const updateMutation = useUpdateContribution();
  const { data: projectQualifs = [] } = useProjectQualifs();
  const { data: statuses = [] } = useContributionStatuses();
  const { data: contribution } = useContribution(open ? id : undefined);

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
    content: "",
    editorProps: {
      attributes: { class: "tiptap-content" },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const summary = contribution?.notes_raw ?? defaultValues?.summary ?? "";
    editor.commands.setContent(summary);

    form.setFieldsValue({
      projectQualification: contribution?.project_qualification?.id,
      visibility:
        contribution?.status?.label === "ARCHIVED"
          ? "ARCHIVED"
          : contribution
            ? contribution.is_public
              ? "PUBLIC"
              : "PRIVATE"
            : defaultValues?.visibility,
      rdvDate: contribution?.meeting_date
        ? dayjs(contribution.meeting_date)
        : defaultValues?.rdvDate
          ? dayjs(defaultValues.rdvDate)
          : null,
      reminderDate: contribution?.reminder_date
        ? dayjs(contribution.reminder_date)
        : defaultValues?.reminderDate
          ? dayjs(defaultValues.reminderDate)
          : null,
    });
  }, [contribution, defaultValues, editor, form]);

  const handleClose = () => {
    form.resetFields();
    editor?.commands.clearContent();
    onClose();
  };

  const handleSave = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    const payload: Record<string, unknown> = {
      notes_raw: editor?.getHTML() || "",
      project_qualification: values.projectQualification || null,
      meeting_date: values.rdvDate?.toISOString() || null,
      reminder_date: values.reminderDate?.toISOString() || null,
    };

    if (values.visibility === "ARCHIVED") {
      const archived = statuses?.find((s) => s.label === "ARCHIVED");
      if (archived) payload.status = archived.id;
    } else {
      payload.is_public = values.visibility === "PUBLIC";
      payload.status = null;
    }

    try {
      await updateMutation.mutateAsync({ id, data: payload });
      message.success("Contribution mise à jour !");
      onSubmit?.(payload);
      handleClose();
    } catch {
      message.error("Mise à jour impossible");
    }
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      width={520}
      className={styles.drawer}
      destroyOnClose
      maskClosable={!updateMutation.isPending}
      keyboard={!updateMutation.isPending}
      closable={!updateMutation.isPending}
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
          <Select
            placeholder="Sélectionner une qualification…"
            options={projectQualifs.map((q) => ({ value: q.id, label: q.label }))}
          />
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
            <Button onClick={handleClose} disabled={updateMutation.isPending}>
              Annuler
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              loading={updateMutation.isPending}
              disabled={updateMutation.isPending}
            >
              Enregistrer
            </Button>
          </Space>
        </div>
      </Form>
    </Drawer>
  );
}

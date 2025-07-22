"use client";

import {
  Drawer,
  Steps,
  Form,
  Select,
  Button,
  Space,
  Divider,
  App,
  Input,
} from "antd";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./NewContributionDrawer.module.scss";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Extension } from "@tiptap/core";

import TiptapMenuBar from "@/components/TipTapMenuBar/TipTapMenuBar";
import OrganizationSelector, {
  type OrganizationValue,
} from "@/components/OrganizationSelector/OrganizationSelector";
import { useCreateContribution } from "@/hooks/useCreateContribution";
import { useSectors } from "@/hooks/useSectors";
import { useOrigins } from "@/hooks/useOrigins";
import { useContactQualifs } from "@/hooks/useContactQualifs";
import { useProjectQualifs } from "@/hooks/useProjectQualifs";

const { Step } = Steps;


type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: Record<string, unknown>) => void;
};

/* ────────────────────────────────────────────────────────── */
/* Extension custom FontSize                                 */
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

/* ────────────────────────────────────────────────────────── */
/* Composant principal                                       */
export default function NewContributionDrawer({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [form] = Form.useForm();
  const [organization, setOrganization] = useState<OrganizationValue>();
  const { message } = App.useApp();
  const createMutation = useCreateContribution();
  const { data: sectors = [] } = useSectors();
  const { data: origins = [] } = useOrigins();
  const { data: contactQualifs = [] } = useContactQualifs();
  const { data: projectQualifs = [] } = useProjectQualifs();

  /* ────── TIPTAP EDITOR ────── */
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
    const handler = () => {
      form.setFieldValue("summary", editor.getHTML());
    };
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, form]);

  /* ────── Navigation Wizard ────── */
  const next = () => {
    form
      .validateFields()
      .then(() => {
        if (current === 0 && !organization) {
          message.error("Client requis");
          return;
        }
        setCurrent((c) => {
          const nextStep = c + 1;
          setMaxStep((m) => Math.max(m, nextStep));
          return nextStep;
        });
      })
      .catch(() => {
        /* AntD affiche déjà les erreurs */
      });
  };

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  const handleClose = () => {
    form.resetFields();
    setCurrent(0);
    setMaxStep(0);
    setOrganization(undefined);
    editor?.commands.setContent("");
    onClose();
  };

  const finish = async () => {
    const values = await form.validateFields();
    if (!organization) {
      message.error("Client requis");
      return;
    }

    await createMutation.mutateAsync({
      organization: organization.id,
      organizationName: organization.name,
      sector: values.sector,
      contactOrigin: values.contactOrigin,
      contactQualification: values.contactQualification,
      projectQualification: values.projectQualification,
      visibility: values.visibility,
      summary: editor?.getHTML() || "",
      firstName: values.firstName,
      lastName: values.lastName,
      position: values.position,
      email: values.email,
      phone: values.phone,
      region: values.region,
    });

    onSubmit?.({
      organization,
      ...values,
      summary: editor?.getHTML() || "",
    });

    form.resetFields();
    setCurrent(0);
    setOrganization(undefined);
    editor?.commands.setContent("");
    onClose();
  };

  /* ────── Rendu ────── */
  return (
    <Drawer
      open={open}
      onClose={handleClose}
      width="100%"
      className={styles.drawer}
      destroyOnHidden
      closable
    >
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* STEPPER */}
        <Steps
          className={styles.steps}
          current={current}
          responsive
          onChange={(step) => {
            if (step <= maxStep) setCurrent(step);
          }}
        >
          <Step title="Entité" />
          <Step title="Compte-rendu" />
          <Step title="Validation" />
        </Steps>

        {/* FORMULAIRE */}
        <div className={styles.formWrapper}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ visibility: "PUBLIC", summary: "" }}
          >
            {/* ────── Étape 0 ────── */}
            {current === 0 && (
              <>
                <Form.Item
                  label="Nom de l’entreprise / collectivité"
                  required
                >
                  <OrganizationSelector
                    value={organization}
                    onChange={setOrganization}
                  />
                </Form.Item>

                <Space direction="horizontal" size="large" wrap>
                  <Form.Item
                    label="Secteur d’activité"
                    name="sector"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Choisir…"
                      options={sectors.map((s) => ({ value: s.id, label: s.label }))}
                      style={{ minWidth: 200 }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Origine du contact"
                    name="contactOrigin"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Prospect, Client…"
                      options={origins.map((o) => ({ value: o.id, label: o.label }))}
                      style={{ minWidth: 200 }}
                    />
                  </Form.Item>
                </Space>

                <Space direction="horizontal" size="large" wrap>
                  <Form.Item
                    label="Prénom"
                    name="firstName"
                    rules={[{ required: true }]}
                  >
                    <Input style={{ minWidth: 160 }} />
                  </Form.Item>

                  <Form.Item
                    label="Nom"
                    name="lastName"
                    rules={[{ required: true }]}
                  >
                    <Input style={{ minWidth: 160 }} />
                  </Form.Item>
                </Space>

                <Space direction="horizontal" size="large" wrap>
                  <Form.Item
                    label="Fonction"
                    name="position"
                    rules={[{ required: true }]}
                  >
                    <Input style={{ minWidth: 160 }} />
                  </Form.Item>

                  <Form.Item
                    label="Qualification"
                    name="contactQualification"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Sélectionner…"
                      options={contactQualifs.map((q) => ({ value: q.id, label: q.label }))}
                      style={{ minWidth: 160 }}
                    />
                  </Form.Item>
                </Space>

                <Space direction="horizontal" size="large" wrap>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email" }]}
                  >
                    <Input style={{ minWidth: 200 }} />
                  </Form.Item>

                  <Form.Item
                    label="Téléphone"
                    name="phone"
                    rules={[{ required: true }]}
                  >
                    <Input style={{ minWidth: 160 }} />
                  </Form.Item>

                  <Form.Item
                    label="Région"
                    name="region"
                    rules={[{ required: true }]}
                  >
                    <Input style={{ minWidth: 120 }} />
                  </Form.Item>
                </Space>
              </>
            )}

            {/* ────── Étape 1 ────── */}
            {current === 1 && (
              <>
                <TiptapMenuBar editor={editor} />

                  <Form.Item
                    label="Compte-rendu"
                    rules={[
                      { required: true, message: "Écrivez un compte-rendu" },
                    ]}
                  >
                    {editor && (
                      <div className={styles.tiptapEditor}>
                        <EditorContent editor={editor} />
                      </div>
                    )}
                  </Form.Item>

                  <Form.Item
                    label="Qualification du projet"
                    name="projectQualification"
                  >
                    <Select
                      options={projectQualifs.map((q) => ({ value: q.id, label: q.label }))}
                      placeholder="Sélectionner…"
                    />
                  </Form.Item>
                </>
            )}

            {/* ────── Étape 2 ────── */}
            {current === 2 && (
              <>
                <Divider />
                <p className={styles.recapTitle}>Récapitulatif rapide</p>
                  <Form.Item
                    name="visibility"
                    label="Visibilité"
                  >
                    <Select
                      options={[
                        { value: "PUBLIC", label: "Publique" },
                        { value: "PRIVATE", label: "Privée" },
                      ]}
                      style={{ maxWidth: 200 }}
                    />
                  </Form.Item>
                </>
            )}
          </Form>
        </div>

        {/* FOOTER ACTIONS */}
        <div className={styles.footer}>
          <Button onClick={handleClose} style={{ marginRight: "auto" }}>
            Annuler
          </Button>
          {current > 0 && (
            <Button onClick={prev} style={{ marginRight: 8 }}>
              Précédent
            </Button>
          )}
          {current < 2 && (
            <Button type="primary" onClick={next}>
              Suivant
            </Button>
          )}
          {current === 2 && (
            <Button type="primary" onClick={finish}>
              Enregistrer
            </Button>
          )}
        </div>
      </motion.div>
    </Drawer>
  );
}

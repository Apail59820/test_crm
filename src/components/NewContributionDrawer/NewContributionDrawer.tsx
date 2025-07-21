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
} from "antd";
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./NewContributionDrawer.module.scss";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Extension } from "@tiptap/core";

import TiptapMenuBar from "@/components/TipTapMenuBar/TipTapMenuBar";
import OrganizationSelector, {
  type OrganizationValue,
} from "@/components/OrganizationSelector/OrganizationSelector";
import { useCreateContribution } from "@/hooks/useCreateContribution";

const { Step } = Steps;

/* ────────────────────────────────────────────────────────── */
/* Données fixes                                             */
const sectors = [
  "Promoteur",
  "Constructeur",
  "Architecte",
  "Collectivités",
  "Entreprises",
  "Services",
  "Autre",
];

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
  const [form] = Form.useForm();
  const [organization, setOrganization] = useState<OrganizationValue>();
  const { message } = App.useApp();
  const createMutation = useCreateContribution();

  /* ────── TIPTAP EDITOR ────── */
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      FontSize,
    ],
    content: "",
    editorProps: {
      attributes: { class: "tiptap-content" },
    },
  });

  /* ────── Navigation Wizard ────── */
  const next = () => {
    form
      .validateFields()
      .then(() => setCurrent((c) => c + 1))
      .catch(() => {
        /* AntD affiche déjà les erreurs */
      });
  };

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

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
      contactType: values.contactType,
      qualification: values.qualification,
      visibility: values.visibility,
      summary: editor?.getHTML() || "",
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
      onClose={() => {
        form.resetFields();
        setCurrent(0);
        editor?.commands.setContent("");
        onClose();
      }}
      width="100%"
      className={styles.drawer}
      destroyOnClose
      closable={false}
    >
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* STEPPER */}
        <Steps current={current} responsive>
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
                      preserve={false}
                      label="Secteur d’activité"
                      name="sector"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Choisir…"
                        options={sectors.map((s) => ({ value: s, label: s }))}
                        style={{ minWidth: 200 }}
                      />
                    </Form.Item>

                    <Form.Item
                      preserve={false}
                      label="Type de contact"
                      name="contactType"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Prospect, Client…"
                        options={[
                          "Prospect",
                          "Client",
                          "Partenaire",
                          "Informateur",
                        ].map((t) => ({ value: t, label: t }))}
                        style={{ minWidth: 200 }}
                      />
                </Form.Item>
              </Space>
              </>
            )}

            {/* ────── Étape 1 ────── */}
            {current === 1 && (
              <>
                <TiptapMenuBar editor={editor} />

                  <Form.Item
                    preserve={false}
                    label="Compte-rendu"
                    name="summary"
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
                    preserve={false}
                    label="Qualification du projet"
                    name="qualification"
                  >
                    <Select
                      options={[
                        "Information",
                        "Projet à lancer (délai inconnu)",
                        "Projet à lancer < 6 mois",
                        "Projet lancé",
                        "Projet terminé",
                      ].map((q) => ({ value: q, label: q }))}
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
                    preserve={false}
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

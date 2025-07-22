"use client";

import {
  Drawer,
  Steps,
  Form,
  Select,
  Button,
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

import {
  Building2,
  Landmark,
  Network,
  User,
  Users,
  Briefcase,
  Star,
  Mail,
  Phone,
  MapPin,
  Eye,
} from "lucide-react";

const { Step } = Steps;

type Props = {
  open: boolean;
  onClose: () => void;
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
      .catch(() => {});
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
    await form.validateFields();
    const values = form.getFieldsValue(true);

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

        <div className={styles.formWrapper}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ visibility: "PUBLIC", summary: "" }}
          >
            {current === 0 && (
              <div className={styles.stepWrapper}>
                <section className={styles.block}>
                  <h3 className={styles.blockTitle}>Organisation</h3>
                  <Form.Item
                    label={
                      <span>
                        <Building2 className={styles.icon} /> Nom de l’entreprise / collectivité
                      </span>
                    }
                    required
                  >
                    <OrganizationSelector
                      value={organization}
                      onChange={setOrganization}
                    />
                  </Form.Item>

                  <div className={styles.grid}>
                    <Form.Item
                      label={<span><Landmark className={styles.icon} /> Secteur d’activité</span>}
                      name="sector"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Choisir…"
                        options={sectors.map((s) => ({
                          value: s.id,
                          label: s.label,
                        }))}
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span><Network className={styles.icon} /> Origine du contact</span>}
                      name="contactOrigin"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Comment le contact a été initié"
                        options={origins.map((o) => ({
                          value: o.id,
                          label: o.label,
                        }))}
                      />
                    </Form.Item>
                  </div>
                </section>

                <section className={styles.block}>
                  <h3 className={styles.blockTitle}>Contact principal</h3>
                  <div className={styles.grid}>
                    <Form.Item
                      label={<span><User className={styles.icon} /> Prénom</span>}
                      name="firstName"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={<span><Users className={styles.icon} /> Nom</span>}
                      name="lastName"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={<span><Briefcase className={styles.icon} /> Fonction</span>}
                      name="position"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={<span><Star className={styles.icon} /> Qualification</span>}
                      name="contactQualification"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Niveau de qualification"
                        options={contactQualifs.map((q) => ({
                          value: q.id,
                          label: q.label,
                        }))}
                      />
                    </Form.Item>
                  </div>

                  <div className={styles.grid}>
                    <Form.Item
                      label={<span><Mail className={styles.icon} /> Email</span>}
                      name="email"
                      rules={[{ required: true, type: "email" }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={<span><Phone className={styles.icon} /> Téléphone</span>}
                      name="phone"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={<span><MapPin className={styles.icon} /> Région</span>}
                      name="region"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>
                </section>
              </div>
            )}

            {current === 1 && (
              <>
                <TiptapMenuBar editor={editor} />

                <Form.Item
                  label="Compte-rendu"
                  rules={[{ required: true, message: "Écrivez un compte-rendu" }]}
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
                    options={projectQualifs.map((q) => ({
                      value: q.id,
                      label: q.label,
                    }))}
                    placeholder="Sélectionner…"
                  />
                </Form.Item>
              </>
            )}

            {current === 2 && (
              <>
                <Divider />
                <p className={styles.recapTitle}>Récapitulatif rapide</p>
                <Form.Item
                  name="visibility"
                  label={<span><Eye className={styles.icon} /> Visibilité</span>}
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
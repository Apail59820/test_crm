"use client";

import { Drawer, Form, Select, Input, Button } from "antd";
import { useEffect } from "react";
import styles from "./ContributionEditDrawer.module.scss";

import { useContribution } from "@/hooks/useContribution";
import { useUpdateContribution } from "@/hooks/useUpdateContribution";
import { useProjectQualifs } from "@/hooks/useProjectQualifs";

export default function ContributionEditDrawer({
  open,
  onClose,
  id,
}: {
  open: boolean;
  onClose: () => void;
  id?: string;
}) {
  const { data } = useContribution(id);
  const { data: projectQualifs = [] } = useProjectQualifs();
  const updateMutation = useUpdateContribution();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!data) return;
    form.setFieldsValue({
      summary: data.notes_raw,
      projectQualification: data.project_qualification?.id,
      visibility: data.status?.label === "ARCHIVED" ? "ARCHIVED" : data.is_public ? "PUBLIC" : "PRIVATE",
    });
  }, [data, form]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue(true);
    await updateMutation.mutateAsync({
      id: id!,
      data: {
        notes_raw: values.summary,
        project_qualification: values.projectQualification,
        is_public: values.visibility === "PUBLIC",
      },
    });
    handleClose();
  };

  return (
    <Drawer open={open} onClose={handleClose} width={580} className={styles.drawer} destroyOnClose>
      <Form form={form} layout="vertical" style={{ padding: 24 }}>
        <Form.Item label="Compte-rendu" name="summary">
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item label="Qualification du projet" name="projectQualification">
          <Select
            options={projectQualifs.map((q) => ({ value: q.id, label: q.label }))}
            placeholder="Sélectionner…"
          />
        </Form.Item>
        <Form.Item label="Visibilité" name="visibility">
          <Select
            options={[
              { value: "PUBLIC", label: "Publique" },
              { value: "PRIVATE", label: "Privée" },
              { value: "ARCHIVED", label: "Archivée" },
            ]}
            style={{ maxWidth: 200 }}
          />
        </Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={handleClose}>Annuler</Button>
          <Button type="primary" onClick={handleSubmit} loading={updateMutation.isPending}>
            Enregistrer
          </Button>
        </div>
      </Form>
    </Drawer>
  );
}

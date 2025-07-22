"use client";

import { Select, Spin, Alert, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useOrganizations } from "@/hooks/useOrganizations";

export type OrganizationValue = { id?: string; name: string } | undefined;

export default function OrganizationSelector({
  value,
  onChange,
}: {
  value?: OrganizationValue;
  onChange?: (val: OrganizationValue) => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { data: options = [], isLoading } = useOrganizations(search);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (val) {
      setOpen(true);
    }
  };

  const duplicate = search
    ? options.some((o) => o.name.toLowerCase() === search.toLowerCase())
    : false;

  return (
    <div>
      <Select
        showSearch
        labelInValue
        value={
          value
            ? value.id
              ? { value: value.id, label: value.name }
              : { value: "", label: value.name }
            : undefined
        }
        onSearch={handleSearch}
        filterOption={false}
        notFoundContent={isLoading ? <Spin size="small" /> : null}
        onChange={(val) => {
          onChange?.({ id: val.value || undefined, name: val.label });
          setOpen(false);
          setSearch("");
        }}
        options={options.map((o) => ({ value: o.id, label: o.name }))}
        style={{ width: "100%" }}
        placeholder="Rechercher ou créer…"
        open={open}
        onOpenChange={(visible) => {
          setOpen(visible);
          if (!visible) {
            setSearch("");
          }
        }}
        popupRender={(menu) => (
          <>
            {menu}
            {search && !duplicate && (
              <>
                <Divider style={{ margin: "8px 0" }} />
                <div
                  style={{ padding: "8px", cursor: "pointer" }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange?.({ name: search });
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <PlusOutlined style={{ marginRight: 8 }} /> Créer &quot;{search}&quot;
                </div>
              </>
            )}
          </>
        )}
      />
      {duplicate && (
        <Alert
          type="warning"
          showIcon
          style={{ marginTop: 8 }}
          message="Un client similaire existe déjà."
        />
      )}
    </div>
  );
}

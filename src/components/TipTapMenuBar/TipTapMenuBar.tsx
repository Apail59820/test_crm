"use client";

import { Editor } from "@tiptap/react";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  UndoOutlined,
  RedoOutlined,
  LinkOutlined,
  HighlightOutlined,
  FontColorsOutlined,
} from "@ant-design/icons";
import { Button, Space, Tooltip, Dropdown, MenuProps } from "antd";

export default function TiptapMenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const colors = [
    "#000000",
    "#db4437",
    "#f4b400",
    "#0f9d58",
    "#4285f4",
    "#ffffff",
  ];

  const colorMenu: MenuProps = {
    items: colors.map((c) => ({
      key: c,
      label: (
        <div
          style={{
            background: c,
            width: 16,
            height: 16,
            borderRadius: 3,
            border: c === "#ffffff" ? "1px solid #ddd" : "none",
          }}
        />
      ),
      onClick: () =>
        (editor?.chain().focus() as unknown as {
          setColor: (color: string) => { run(): void };
        }).setColor(c).run(),
    })),
  };

  return (
    <Space wrap size="small" style={{ marginBottom: 8 }}>
      <Tooltip title="Gras">
        <Button
          icon={<BoldOutlined />}
          type={editor.isActive("bold") ? "primary" : "default"}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
      </Tooltip>

      <Tooltip title="Italique">
        <Button
          icon={<ItalicOutlined />}
          type={editor.isActive("italic") ? "primary" : "default"}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
      </Tooltip>

      <Tooltip title="Souligné">
        <Button
          icon={<UnderlineOutlined />}
          type={editor.isActive("underline") ? "primary" : "default"}
          onClick={() =>
            (editor?.chain().focus() as unknown as {
              toggleUnderline: () => { run(): void };
            })
              .toggleUnderline()
              .run()
          }
        />
      </Tooltip>

      <Tooltip title="Barré">
        <Button
          icon={<StrikethroughOutlined />}
          type={editor.isActive("strike") ? "primary" : "default"}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        />
      </Tooltip>

      <Tooltip title="Liste ordonnée">
        <Button
          icon={<OrderedListOutlined />}
          type={editor.isActive("orderedList") ? "primary" : "default"}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        />
      </Tooltip>

      <Tooltip title="Liste à puces">
        <Button
          icon={<UnorderedListOutlined />}
          type={editor.isActive("bulletList") ? "primary" : "default"}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        />
      </Tooltip>

      <Dropdown menu={colorMenu} trigger={["click"]}>
        <Button icon={<FontColorsOutlined />} />
      </Dropdown>

      <Tooltip title="Surlignage">
        <Button
          icon={<HighlightOutlined />}
          type={editor.isActive("highlight") ? "primary" : "default"}
          onClick={() =>
            (editor?.chain().focus() as unknown as {
              toggleHighlight: () => { run(): void };
            })
              .toggleHighlight()
              .run()
          }
        />
      </Tooltip>

      <Tooltip title="Lien">
        <Button
          icon={<LinkOutlined />}
          type={editor.isActive("link") ? "primary" : "default"}
          onClick={() => {
            const url = prompt("URL ?");
            if (url) {
              (
                editor?.chain().focus().extendMarkRange("link") as unknown as {
                  setLink: (opts: { href: string }) => { run(): void };
                }
              )
                .setLink({ href: url })
                .run();
            }
          }}
        />
      </Tooltip>

      <Tooltip title="Undo">
        <Button icon={<UndoOutlined />} onClick={() => editor?.chain().undo().run()} />
      </Tooltip>

      <Tooltip title="Redo">
        <Button icon={<RedoOutlined />} onClick={() => editor?.chain().redo().run()} />
      </Tooltip>
    </Space>
  );
}

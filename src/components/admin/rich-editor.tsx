"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import {
  CustomButton,
  DEFAULT_BUTTON_ATTRS,
  type ButtonAttrs,
} from "@/lib/tiptap/extensions/custom-button";
import { ResizableImage } from "@/lib/tiptap/extensions/resizable-image";
import {
  TwoColumnSection,
  ColumnMedia,
  ColumnContent,
  DEFAULT_TWO_COL_ATTRS,
  type TwoColumnAttrs,
} from "@/lib/tiptap/extensions/two-column";
import {
  PageSection,
  DEFAULT_SECTION_ATTRS,
  type PageSectionAttrs,
} from "@/lib/tiptap/extensions/page-section";
import {
  DEFAULT_CONTENT_SETTINGS,
  type LandingContent,
  type LandingContentSettings,
} from "@/lib/tiptap/content";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Upload,
  Highlighter,
  Palette,
  Pilcrow,
  Code2,
  MousePointerClick,
  Settings2,
  X,
  ChevronDown,
  PanelLeftDashed,
  PanelRightDashed,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RichEditorProps {
  content: LandingContent;
  onChange: (content: LandingContent) => void;
  themeColors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function RichEditor({ content, onChange, themeColors }: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const suppressNextUpdate = useRef(false);

  // Layout / page-level settings
  const [settings, setSettings] = useState<LandingContentSettings>(() => ({
    ...DEFAULT_CONTENT_SETTINGS,
    ...(content?.settings ?? {}),
  }));
  const [showLayoutPanel, setShowLayoutPanel] = useState(false);

  // Inline color pickers
  const [textColor, setTextColor] = useState(themeColors?.primary ?? "#111827");
  const [hlColor, setHlColor] = useState("#FFF3BF");

  // Button editor panel
  const [showBtnPanel, setShowBtnPanel] = useState(false);
  const [btnAttrs, setBtnAttrs] = useState<ButtonAttrs>({ ...DEFAULT_BUTTON_ATTRS });

  // Image editor panel
  const [showImgPanel, setShowImgPanel] = useState(false);
  const [imgWidth, setImgWidth] = useState("100%");
  const [imgAlign, setImgAlign] = useState<"left" | "center" | "right">("center");

  // Two-column section panel
  const [showTwoColPanel, setShowTwoColPanel] = useState(false);
  const [twoColAttrs, setTwoColAttrs] = useState<TwoColumnAttrs>({ ...DEFAULT_TWO_COL_ATTRS });

  // Page section panel
  const [showSectionPanel, setShowSectionPanel] = useState(false);
  const [sectionAttrs, setSectionAttrs] = useState<PageSectionAttrs>({ ...DEFAULT_SECTION_ATTRS });

  // Propagate settings changes upward
  const emitChange = useCallback(
    (doc: any, s: LandingContentSettings) => {
      onChange({ doc, settings: s });
    },
    [onChange]
  );

  // When settings change, emit
  const updateSettings = useCallback(
    (patch: Partial<LandingContentSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        return next;
      });
    },
    []
  );

  // Emit settings changes (debounced via effect)
  useEffect(() => {
    if (!editor) return;
    emitChange(editor.getJSON(), settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // ---- TipTap editor ----
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      ResizableImage.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline cursor-pointer" },
      }),
      Youtube.configure({
        HTMLAttributes: { class: "w-full aspect-video rounded-lg" },
        width: 640,
        height: 360,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: "Start writing your landing page content...",
      }),
      CustomButton,
      TwoColumnSection,
      ColumnMedia,
      ColumnContent,
      PageSection,
    ],
    content: content?.doc || "",
    onUpdate: ({ editor: ed }) => {
      if (suppressNextUpdate.current) {
        suppressNextUpdate.current = false;
        return;
      }
      emitChange(ed.getJSON(), settings);

      // Detect if cursor is on a customButton node
      const { $from } = ed.state.selection;
      const node = $from.parent;
      if (node.type.name === "customButton") {
        setBtnAttrs({ ...DEFAULT_BUTTON_ATTRS, ...(node.attrs as Partial<ButtonAttrs>) });
        setShowBtnPanel(true);
      } else {
        setShowBtnPanel(false);
      }

      // Detect if cursor is on an image node
      const sel = ed.state.selection;
      const selectedNode = (sel as any).node;
      if (selectedNode?.type?.name === "image") {
        setImgWidth(selectedNode.attrs.width || "100%");
        setImgAlign(selectedNode.attrs.align || "center");
        setShowImgPanel(true);
      } else {
        setShowImgPanel(false);
      }

      // Detect if cursor is inside a twoColumnSection or pageSection
      let depth = $from.depth;
      let foundTwoCol = false;
      let foundSection = false;
      while (depth > 0) {
        const ancestor = $from.node(depth);
        if (ancestor.type.name === "twoColumnSection" && !foundTwoCol) {
          setTwoColAttrs({ ...DEFAULT_TWO_COL_ATTRS, ...(ancestor.attrs as Partial<TwoColumnAttrs>) });
          setShowTwoColPanel(true);
          foundTwoCol = true;
        }
        if (ancestor.type.name === "pageSection" && !foundSection) {
          setSectionAttrs({ ...DEFAULT_SECTION_ATTRS, ...(ancestor.attrs as Partial<PageSectionAttrs>) });
          setShowSectionPanel(true);
          foundSection = true;
        }
        depth--;
      }
      if (!foundTwoCol) setShowTwoColPanel(false);
      if (!foundSection) setShowSectionPanel(false);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px] px-6 py-4",
      },
    },
    immediatelyRender: false,
  });

  // Sync external content changes
  useEffect(() => {
    if (!editor || !content?.doc) return;
    const currentJson = JSON.stringify(editor.getJSON());
    const nextJson = JSON.stringify(content.doc);
    if (currentJson !== nextJson) {
      suppressNextUpdate.current = true;
      editor.commands.setContent(content.doc);
    }
  }, [editor, content?.doc]);

  // ---- Callbacks ----
  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      try {
        toast.loading("Uploading image...", { id: "upload" });
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
        toast.success("Image uploaded!", { id: "upload" });
      } catch (err: any) {
        toast.error(err.message || "Upload failed", { id: "upload" });
      }
      e.target.value = "";
    },
    [editor]
  );

  const addImageByUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url, alt: "Image" }).run();
  }, [editor]);

  const addYoutubeVideo = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter YouTube video URL:");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const applyTextColor = useCallback(
    (color: string) => {
      if (!editor) return;
      setTextColor(color);
      editor.chain().focus().setColor(color).run();
    },
    [editor]
  );

  const applyHighlight = useCallback(
    (color: string) => {
      if (!editor) return;
      setHlColor(color);
      editor.chain().focus().toggleHighlight({ color }).run();
    },
    [editor]
  );

  const insertButton = useCallback(() => {
    if (!editor) return;
    const attrs = { ...DEFAULT_BUTTON_ATTRS, backgroundColor: themeColors?.primary ?? "#111827" };
    editor.commands.insertCustomButton(attrs);
  }, [editor, themeColors]);

  const updateButtonAttr = useCallback(
    (key: keyof ButtonAttrs, value: any) => {
      if (!editor) return;
      setBtnAttrs((prev) => ({ ...prev, [key]: value }));
      editor.commands.updateCustomButton({ [key]: value });
    },
    [editor]
  );

  const updateImageAttr = useCallback(
    (key: string, value: string) => {
      if (!editor) return;
      if (key === "width") setImgWidth(value);
      if (key === "align") setImgAlign(value as any);
      editor.commands.updateAttributes("image", { [key]: value });
    },
    [editor]
  );

  const insertTwoCol = useCallback(
    (layout: "media-left" | "media-right") => {
      if (!editor) return;
      editor.commands.insertTwoColumnSection({ layout });
    },
    [editor]
  );

  const updateTwoColAttr = useCallback(
    (key: keyof TwoColumnAttrs, value: any) => {
      if (!editor) return;
      setTwoColAttrs((prev) => ({ ...prev, [key]: value }));
      editor.commands.updateTwoColumnSection({ [key]: value });
    },
    [editor]
  );

  const insertSection = useCallback(
    (bgColor?: string) => {
      if (!editor) return;
      editor.commands.insertPageSection({
        backgroundColor: bgColor || "transparent",
        textColor: bgColor && bgColor !== "transparent" ? "#ffffff" : "#111827",
      });
    },
    [editor]
  );

  const updateSectionAttr = useCallback(
    (key: keyof PageSectionAttrs, value: any) => {
      if (!editor) return;
      setSectionAttrs((prev) => ({ ...prev, [key]: value }));
      editor.commands.updatePageSection({ [key]: value });
    },
    [editor]
  );

  if (!editor) return null;

  const wordCount = editor.getText().split(/\s+/).filter((w) => w).length;
  const charCount = editor.getText().length;

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        className="hidden"
      />

      {/* ===== Row 1: Main formatting toolbar ===== */}
      <div className="border-b bg-gray-50/80 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSep />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSep />

        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <Pilcrow className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSep />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSep />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* ===== Row 2: Colors, media, buttons, layout ===== */}
      <div className="border-b bg-gray-50/50 px-2 py-1.5 flex flex-wrap items-center gap-1">
        {/* Text color picker */}
        <div className="flex items-center gap-1" title="Text Color">
          <Palette className="h-3.5 w-3.5 text-gray-500" />
          <input
            type="color"
            value={textColor}
            onChange={(e) => applyTextColor(e.target.value)}
            className="h-6 w-6 rounded border border-gray-300 cursor-pointer p-0"
          />
        </div>

        {/* Highlight color picker */}
        <div className="flex items-center gap-1" title="Highlight Color">
          <Highlighter className="h-3.5 w-3.5 text-gray-500" />
          <input
            type="color"
            value={hlColor}
            onChange={(e) => applyHighlight(e.target.value)}
            className="h-6 w-6 rounded border border-gray-300 cursor-pointer p-0"
          />
        </div>

        <ToolbarSep />

        {/* Links */}
        <ToolbarButton
          onClick={handleSetLink}
          active={editor.isActive("link")}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove Link"
          >
            <Unlink className="h-4 w-4" />
          </ToolbarButton>
        )}

        <ToolbarSep />

        {/* Media */}
        <ToolbarButton onClick={handleImageUpload} title="Upload Image">
          <Upload className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImageByUrl} title="Image from URL">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addYoutubeVideo} title="YouTube Video">
          <YoutubeIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSep />

        {/* Insert CTA Button */}
        <ToolbarButton onClick={insertButton} title="Insert CTA Button">
          <MousePointerClick className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSep />

        {/* Add Section */}
        <ToolbarButton onClick={() => insertSection()} title="Add Section">
          <Layers className="h-4 w-4" />
        </ToolbarButton>

        {/* Two-column layout */}
        <ToolbarButton
          onClick={() => insertTwoCol("media-left")}
          title="Two Columns: Media Left"
        >
          <PanelLeftDashed className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertTwoCol("media-right")}
          title="Two Columns: Media Right"
        >
          <PanelRightDashed className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSep />

        {/* Page Layout Settings toggle */}
        <ToolbarButton
          onClick={() => setShowLayoutPanel(!showLayoutPanel)}
          active={showLayoutPanel}
          title="Page Layout Settings"
        >
          <Settings2 className="h-4 w-4" />
        </ToolbarButton>

        {/* Theme color quick-apply */}
        {themeColors && (
          <>
            <ToolbarSep />
            <span className="text-[10px] text-muted-foreground mr-1">Theme:</span>
            {Object.entries(themeColors).map(([key, color]) => (
              <button
                key={key}
                type="button"
                onClick={() => editor.chain().focus().setColor(color).run()}
                className="h-5 w-5 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={`Apply ${key} color`}
              />
            ))}
          </>
        )}
      </div>

      {/* ===== Collapsible: Page Layout Settings ===== */}
      {showLayoutPanel && (
        <div className="border-b bg-blue-50/50 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Page Layout Settings
            </h4>
            <button
              type="button"
              onClick={() => setShowLayoutPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <Label className="text-[11px]">Max Width (px)</Label>
              <Input
                type="number"
                value={settings.maxWidth}
                onChange={(e) => updateSettings({ maxWidth: Number(e.target.value) || 960 })}
                className="h-8 text-sm"
                min={320}
                max={1920}
              />
            </div>
            <div>
              <Label className="text-[11px]">Padding X (px)</Label>
              <Input
                type="number"
                value={settings.paddingX}
                onChange={(e) => updateSettings({ paddingX: Number(e.target.value) || 0 })}
                className="h-8 text-sm"
                min={0}
                max={200}
              />
            </div>
            <div>
              <Label className="text-[11px]">Padding Y (px)</Label>
              <Input
                type="number"
                value={settings.paddingY}
                onChange={(e) => updateSettings({ paddingY: Number(e.target.value) || 0 })}
                className="h-8 text-sm"
                min={0}
                max={200}
              />
            </div>
            <div>
              <Label className="text-[11px]">Background Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                  className="h-8 w-8 rounded border border-gray-300 cursor-pointer p-0"
                />
                <Input
                  value={settings.backgroundColor}
                  onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                  className="h-8 text-sm flex-1"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Collapsible: Button Properties ===== */}
      {showBtnPanel && (
        <div className="border-b bg-purple-50/50 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Button Properties
            </h4>
            <button
              type="button"
              onClick={() => setShowBtnPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <Label className="text-[11px]">Link URL</Label>
              <Input
                value={btnAttrs.href}
                onChange={(e) => updateButtonAttr("href", e.target.value)}
                className="h-8 text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="text-[11px]">Background</Label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={btnAttrs.backgroundColor}
                  onChange={(e) => updateButtonAttr("backgroundColor", e.target.value)}
                  className="h-8 w-8 rounded border border-gray-300 cursor-pointer p-0"
                />
                <Input
                  value={btnAttrs.backgroundColor}
                  onChange={(e) => updateButtonAttr("backgroundColor", e.target.value)}
                  className="h-8 text-sm flex-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-[11px]">Text Color</Label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={btnAttrs.textColor}
                  onChange={(e) => updateButtonAttr("textColor", e.target.value)}
                  className="h-8 w-8 rounded border border-gray-300 cursor-pointer p-0"
                />
                <Input
                  value={btnAttrs.textColor}
                  onChange={(e) => updateButtonAttr("textColor", e.target.value)}
                  className="h-8 text-sm flex-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-[11px]">Border Color</Label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={btnAttrs.borderColor}
                  onChange={(e) => updateButtonAttr("borderColor", e.target.value)}
                  className="h-8 w-8 rounded border border-gray-300 cursor-pointer p-0"
                />
                <Input
                  value={btnAttrs.borderColor}
                  onChange={(e) => updateButtonAttr("borderColor", e.target.value)}
                  className="h-8 text-sm flex-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-[11px]">Border Radius (px)</Label>
              <Input
                type="number"
                value={btnAttrs.borderRadius}
                onChange={(e) => updateButtonAttr("borderRadius", Number(e.target.value))}
                className="h-8 text-sm"
                min={0}
                max={999}
              />
            </div>
            <div>
              <Label className="text-[11px]">Padding X / Y</Label>
              <div className="flex gap-1">
                <Input
                  type="number"
                  value={btnAttrs.paddingX}
                  onChange={(e) => updateButtonAttr("paddingX", Number(e.target.value))}
                  className="h-8 text-sm"
                  min={0}
                  placeholder="X"
                />
                <Input
                  type="number"
                  value={btnAttrs.paddingY}
                  onChange={(e) => updateButtonAttr("paddingY", Number(e.target.value))}
                  className="h-8 text-sm"
                  min={0}
                  placeholder="Y"
                />
              </div>
            </div>
            <div>
              <Label className="text-[11px]">Alignment</Label>
              <div className="flex gap-1 mt-1">
                {(["left", "center", "right"] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => updateButtonAttr("align", a)}
                    className={`h-8 px-2 text-xs rounded border ${
                      btnAttrs.align === a
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label className="text-[11px]">Shadow</Label>
                <Switch
                  checked={btnAttrs.shadow}
                  onCheckedChange={(v) => updateButtonAttr("shadow", v)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-[11px]">Full Width</Label>
                <Switch
                  checked={btnAttrs.width === "full"}
                  onCheckedChange={(v) => updateButtonAttr("width", v ? "full" : "auto")}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-[11px]">Outline</Label>
                <Switch
                  checked={btnAttrs.variant === "outline"}
                  onCheckedChange={(v) => updateButtonAttr("variant", v ? "outline" : "solid")}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Collapsible: Section Properties ===== */}
      {showSectionPanel && (
        <div className="border-b bg-amber-50/50 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Section Properties{sectionAttrs.label !== "Section" ? ` — ${sectionAttrs.label}` : ""}
            </h4>
            <button
              type="button"
              onClick={() => setShowSectionPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <Label className="text-[11px]">Label</Label>
              <Input
                value={sectionAttrs.label}
                onChange={(e) => updateSectionAttr("label", e.target.value)}
                className="h-8 text-sm"
                placeholder="e.g. Hero, Features"
              />
            </div>
            <div>
              <Label className="text-[11px]">Background</Label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={sectionAttrs.backgroundColor === "transparent" ? "#ffffff" : sectionAttrs.backgroundColor}
                  onChange={(e) => updateSectionAttr("backgroundColor", e.target.value)}
                  className="h-8 w-8 rounded border border-gray-300 cursor-pointer p-0"
                />
                <Input
                  value={sectionAttrs.backgroundColor}
                  onChange={(e) => updateSectionAttr("backgroundColor", e.target.value)}
                  className="h-8 text-sm flex-1"
                  placeholder="transparent"
                />
              </div>
            </div>
            <div>
              <Label className="text-[11px]">Text Color</Label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={sectionAttrs.textColor}
                  onChange={(e) => updateSectionAttr("textColor", e.target.value)}
                  className="h-8 w-8 rounded border border-gray-300 cursor-pointer p-0"
                />
                <Input
                  value={sectionAttrs.textColor}
                  onChange={(e) => updateSectionAttr("textColor", e.target.value)}
                  className="h-8 text-sm flex-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-[11px]">Padding X / Y</Label>
              <div className="flex gap-1">
                <Input
                  type="number"
                  value={sectionAttrs.paddingX}
                  onChange={(e) => updateSectionAttr("paddingX", Number(e.target.value))}
                  className="h-8 text-sm"
                  min={0}
                  placeholder="X"
                />
                <Input
                  type="number"
                  value={sectionAttrs.paddingY}
                  onChange={(e) => updateSectionAttr("paddingY", Number(e.target.value))}
                  className="h-8 text-sm"
                  min={0}
                  placeholder="Y"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label className="text-[11px]">Full Width</Label>
                <Switch
                  checked={sectionAttrs.fullWidth}
                  onCheckedChange={(v) => updateSectionAttr("fullWidth", v)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-[11px]">Border Bottom</Label>
                <Switch
                  checked={sectionAttrs.borderBottom}
                  onCheckedChange={(v) => updateSectionAttr("borderBottom", v)}
                />
              </div>
            </div>
            {themeColors && (
              <div>
                <Label className="text-[11px]">Quick Theme BG</Label>
                <div className="flex gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      updateSectionAttr("backgroundColor", "transparent");
                      updateSectionAttr("textColor", "#111827");
                    }}
                    className="h-7 w-7 rounded border-2 border-gray-300 bg-white hover:scale-110 transition-transform"
                    title="White / Transparent"
                  />
                  {Object.entries(themeColors).map(([key, color]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        updateSectionAttr("backgroundColor", color);
                        updateSectionAttr("textColor", "#ffffff");
                      }}
                      className="h-7 w-7 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={`${key} background`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Collapsible: Two-Column Properties ===== */}
      {showTwoColPanel && (
        <div className="border-b bg-indigo-50/50 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Two-Column Section
            </h4>
            <button
              type="button"
              onClick={() => setShowTwoColPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <Label className="text-[11px]">Layout</Label>
              <div className="flex gap-1 mt-1">
                {(["media-left", "media-right"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => updateTwoColAttr("layout", l)}
                    className={`h-8 px-2 text-xs rounded border ${
                      twoColAttrs.layout === l
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {l === "media-left" ? "Media Left" : "Media Right"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-[11px]">Background</Label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={twoColAttrs.backgroundColor === "transparent" ? "#ffffff" : twoColAttrs.backgroundColor}
                  onChange={(e) => updateTwoColAttr("backgroundColor", e.target.value)}
                  className="h-8 w-8 rounded border border-gray-300 cursor-pointer p-0"
                />
                <Input
                  value={twoColAttrs.backgroundColor}
                  onChange={(e) => updateTwoColAttr("backgroundColor", e.target.value)}
                  className="h-8 text-sm flex-1"
                  placeholder="transparent"
                />
              </div>
            </div>
            <div>
              <Label className="text-[11px]">Gap (px)</Label>
              <Input
                type="number"
                value={twoColAttrs.gap}
                onChange={(e) => updateTwoColAttr("gap", Number(e.target.value))}
                className="h-8 text-sm"
                min={0}
                max={100}
              />
            </div>
            <div>
              <Label className="text-[11px]">Vertical Align</Label>
              <div className="flex gap-1 mt-1">
                {(["top", "center", "bottom"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateTwoColAttr("verticalAlign", v)}
                    className={`h-8 px-2 text-xs rounded border ${
                      twoColAttrs.verticalAlign === v
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-[11px]">Padding X / Y</Label>
              <div className="flex gap-1">
                <Input
                  type="number"
                  value={twoColAttrs.paddingX}
                  onChange={(e) => updateTwoColAttr("paddingX", Number(e.target.value))}
                  className="h-8 text-sm"
                  min={0}
                  placeholder="X"
                />
                <Input
                  type="number"
                  value={twoColAttrs.paddingY}
                  onChange={(e) => updateTwoColAttr("paddingY", Number(e.target.value))}
                  className="h-8 text-sm"
                  min={0}
                  placeholder="Y"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Collapsible: Image Properties ===== */}
      {showImgPanel && (
        <div className="border-b bg-green-50/50 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Image Properties
            </h4>
            <button
              type="button"
              onClick={() => setShowImgPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-[11px]">Width</Label>
              <div className="flex gap-1">
                {["25%", "50%", "75%", "100%"].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => updateImageAttr("width", w)}
                    className={`h-8 px-2 text-xs rounded border ${
                      imgWidth === w
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-[11px]">Custom Width</Label>
              <Input
                value={imgWidth}
                onChange={(e) => updateImageAttr("width", e.target.value)}
                className="h-8 text-sm"
                placeholder="e.g. 300px or 50%"
              />
            </div>
            <div>
              <Label className="text-[11px]">Alignment</Label>
              <div className="flex gap-1 mt-1">
                {(["left", "center", "right"] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => updateImageAttr("align", a)}
                    className={`h-8 px-3 text-xs rounded border ${
                      imgAlign === a
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {a === "left" ? "Left" : a === "center" ? "Center" : "Right"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Editor content with live preview styling ===== */}
      <div
        style={{
          backgroundColor: settings.backgroundColor,
          maxWidth: `${settings.maxWidth}px`,
          margin: "0 auto",
          padding: `${settings.paddingY}px ${settings.paddingX}px`,
          transition: "all 0.2s ease",
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* ===== Footer: word count ===== */}
      <div className="border-t bg-gray-50/80 px-4 py-1.5 flex items-center justify-between text-xs text-muted-foreground">
        <span>{charCount} characters</span>
        <span>{wordCount} words</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toolbar helpers
// ---------------------------------------------------------------------------

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-brand-primary/10 text-brand-primary"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

function ToolbarSep() {
  return <div className="w-px h-6 bg-gray-200 mx-1" />;
}

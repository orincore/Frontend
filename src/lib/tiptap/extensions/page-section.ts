import { Node, mergeAttributes } from "@tiptap/core";

export interface PageSectionAttrs {
  backgroundColor: string;
  textColor: string;
  paddingX: number;
  paddingY: number;
  fullWidth: boolean;
  borderBottom: boolean;
  label: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pageSection: {
      insertPageSection: (attrs?: Partial<PageSectionAttrs>) => ReturnType;
      updatePageSection: (attrs: Partial<PageSectionAttrs>) => ReturnType;
    };
  }
}

export const DEFAULT_SECTION_ATTRS: PageSectionAttrs = {
  backgroundColor: "transparent",
  textColor: "#111827",
  paddingX: 32,
  paddingY: 48,
  fullWidth: true,
  borderBottom: false,
  label: "Section",
};

export const PageSection = Node.create({
  name: "pageSection",
  group: "block",
  content: "block+",
  defining: true,
  draggable: true,
  selectable: true,
  isolating: true,

  addAttributes() {
    return {
      backgroundColor: { default: DEFAULT_SECTION_ATTRS.backgroundColor },
      textColor: { default: DEFAULT_SECTION_ATTRS.textColor },
      paddingX: { default: DEFAULT_SECTION_ATTRS.paddingX },
      paddingY: { default: DEFAULT_SECTION_ATTRS.paddingY },
      fullWidth: { default: DEFAULT_SECTION_ATTRS.fullWidth },
      borderBottom: { default: DEFAULT_SECTION_ATTRS.borderBottom },
      label: { default: DEFAULT_SECTION_ATTRS.label },
    };
  },

  parseHTML() {
    return [{ tag: "section[data-page-section]" }];
  },

  addCommands() {
    return {
      insertPageSection:
        (attrs?: Partial<PageSectionAttrs>) =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: { ...DEFAULT_SECTION_ATTRS, ...attrs },
              content: [
                {
                  type: "heading",
                  attrs: { level: 2 },
                  content: [{ type: "text", text: "New Section" }],
                },
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Start adding content to this section...",
                    },
                  ],
                },
              ],
            })
            .run(),
      updatePageSection:
        (attrs: Partial<PageSectionAttrs>) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },

  renderHTML({ node }) {
    const a = {
      ...DEFAULT_SECTION_ATTRS,
      ...(node.attrs as Partial<PageSectionAttrs>),
    };

    const style = [
      a.backgroundColor !== "transparent"
        ? `background-color:${a.backgroundColor}`
        : "",
      `color:${a.textColor}`,
      `padding:${a.paddingY}px ${a.paddingX}px`,
      a.fullWidth ? "width:100%" : "",
      a.borderBottom ? "border-bottom:1px solid rgba(0,0,0,0.1)" : "",
    ]
      .filter(Boolean)
      .join(";");

    return [
      "section",
      mergeAttributes({
        "data-page-section": "",
        "data-label": a.label,
        style,
      }),
      0,
    ];
  },
});

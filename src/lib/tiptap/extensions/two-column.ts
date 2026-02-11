import { Node, mergeAttributes } from "@tiptap/core";

export type ColumnLayout = "media-left" | "media-right";

export interface TwoColumnAttrs {
  layout: ColumnLayout;
  backgroundColor: string;
  gap: number;
  paddingX: number;
  paddingY: number;
  verticalAlign: "top" | "center" | "bottom";
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    twoColumnSection: {
      insertTwoColumnSection: (attrs?: Partial<TwoColumnAttrs>) => ReturnType;
      updateTwoColumnSection: (attrs: Partial<TwoColumnAttrs>) => ReturnType;
    };
  }
}

export const DEFAULT_TWO_COL_ATTRS: TwoColumnAttrs = {
  layout: "media-left",
  backgroundColor: "transparent",
  gap: 32,
  paddingX: 32,
  paddingY: 48,
  verticalAlign: "center",
};

// ---------------------------------------------------------------------------
// Wrapper: <div data-two-col>
// ---------------------------------------------------------------------------
export const TwoColumnSection = Node.create({
  name: "twoColumnSection",
  group: "block",
  content: "columnMedia columnContent",
  defining: true,
  draggable: true,
  selectable: true,
  isolating: true,

  addAttributes() {
    return {
      layout: { default: DEFAULT_TWO_COL_ATTRS.layout },
      backgroundColor: { default: DEFAULT_TWO_COL_ATTRS.backgroundColor },
      gap: { default: DEFAULT_TWO_COL_ATTRS.gap },
      paddingX: { default: DEFAULT_TWO_COL_ATTRS.paddingX },
      paddingY: { default: DEFAULT_TWO_COL_ATTRS.paddingY },
      verticalAlign: { default: DEFAULT_TWO_COL_ATTRS.verticalAlign },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-two-col]" }];
  },

  addCommands() {
    return {
      insertTwoColumnSection:
        (attrs?: Partial<TwoColumnAttrs>) =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: { ...DEFAULT_TWO_COL_ATTRS, ...attrs },
              content: [
                {
                  type: "columnMedia",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", text: "Add image or video here" },
                      ],
                    },
                  ],
                },
                {
                  type: "columnContent",
                  content: [
                    {
                      type: "heading",
                      attrs: { level: 2 },
                      content: [{ type: "text", text: "Your Heading" }],
                    },
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "Add your description text here.",
                        },
                      ],
                    },
                  ],
                },
              ],
            })
            .run(),
      updateTwoColumnSection:
        (attrs: Partial<TwoColumnAttrs>) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },

  renderHTML({ node }) {
    const a = { ...DEFAULT_TWO_COL_ATTRS, ...(node.attrs as Partial<TwoColumnAttrs>) };
    const alignMap = { top: "flex-start", center: "center", bottom: "flex-end" };
    const style = [
      "display:flex",
      `flex-direction:${a.layout === "media-right" ? "row-reverse" : "row"}`,
      `gap:${a.gap}px`,
      `padding:${a.paddingY}px ${a.paddingX}px`,
      `align-items:${alignMap[a.verticalAlign]}`,
      a.backgroundColor !== "transparent" ? `background-color:${a.backgroundColor}` : "",
      "margin:1.5rem 0",
      "border-radius:0.75rem",
      "overflow:hidden",
    ]
      .filter(Boolean)
      .join(";");

    return [
      "div",
      mergeAttributes({
        "data-two-col": "",
        "data-layout": a.layout,
        style,
      }),
      0,
    ];
  },
});

// ---------------------------------------------------------------------------
// Media column: holds images, videos, embeds
// ---------------------------------------------------------------------------
export const ColumnMedia = Node.create({
  name: "columnMedia",
  group: "",
  content: "block+",
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: "div[data-col-media]" }];
  },

  renderHTML() {
    return [
      "div",
      mergeAttributes({
        "data-col-media": "",
        style: "flex:1;min-width:0;",
      }),
      0,
    ];
  },
});

// ---------------------------------------------------------------------------
// Content column: holds text, headings, buttons, lists
// ---------------------------------------------------------------------------
export const ColumnContent = Node.create({
  name: "columnContent",
  group: "",
  content: "block+",
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: "div[data-col-content]" }];
  },

  renderHTML() {
    return [
      "div",
      mergeAttributes({
        "data-col-content": "",
        style: "flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;",
      }),
      0,
    ];
  },
});

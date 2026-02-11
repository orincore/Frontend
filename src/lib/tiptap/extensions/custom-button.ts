import { Node, mergeAttributes } from "@tiptap/core";

export type ButtonAlignment = "left" | "center" | "right";
export type ButtonVariant = "solid" | "outline";
export type ButtonWidth = "auto" | "full";

export interface ButtonAttrs {
  href: string;
  align: ButtonAlignment;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  shadow: boolean;
  variant: ButtonVariant;
  width: ButtonWidth;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customButton: {
      insertCustomButton: (attrs?: Partial<ButtonAttrs>) => ReturnType;
      updateCustomButton: (attrs: Partial<ButtonAttrs>) => ReturnType;
    };
  }
}

export const DEFAULT_BUTTON_ATTRS: ButtonAttrs = {
  href: "",
  align: "center",
  backgroundColor: "#111827",
  textColor: "#ffffff",
  borderColor: "#111827",
  borderRadius: 999,
  paddingX: 28,
  paddingY: 14,
  shadow: true,
  variant: "solid",
  width: "auto",
};

export const CustomButton = Node.create({
  name: "customButton",
  group: "block",
  content: "inline*",
  defining: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      ...Object.entries(DEFAULT_BUTTON_ATTRS).reduce(
        (attrs, [key, value]) => ({
          ...attrs,
          [key]: { default: value },
        }),
        {}
      ),
    };
  },

  parseHTML() {
    return [{ tag: "div[data-button]" }];
  },

  addCommands() {
    return {
      insertCustomButton:
        (attrs?: Partial<ButtonAttrs>) =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: { ...DEFAULT_BUTTON_ATTRS, ...attrs },
              content: [
                {
                  type: "text",
                  text: "Call to action",
                },
              ],
            })
            .run(),
      updateCustomButton:
        (attrs: Partial<ButtonAttrs>) =>
        ({ commands }) => commands.updateAttributes(this.name, attrs),
    };
  },

  renderHTML({ node }) {
    const attrs = { ...DEFAULT_BUTTON_ATTRS, ...(node.attrs as Partial<ButtonAttrs>) };
    const wrapperStyle = [`text-align:${attrs.align}`, "margin:1.5rem 0"].join(";");
    const isOutline = attrs.variant === "outline";

    const buttonStyles = [
      "display:inline-flex",
      "align-items:center",
      "justify-content:center",
      `padding:${attrs.paddingY}px ${attrs.paddingX}px`,
      `border-radius:${attrs.borderRadius}px`,
      `border:2px solid ${attrs.borderColor}`,
      attrs.width === "full" ? "width:100%" : "width:auto",
      attrs.width === "full" ? "display:flex" : "display:inline-flex",
      attrs.shadow ? "box-shadow:0 15px 35px rgba(0,0,0,0.12)" : "",
      `background-color:${isOutline ? "transparent" : attrs.backgroundColor}`,
      `color:${attrs.textColor}`,
      "font-weight:600",
      "text-decoration:none",
      "letter-spacing:0.01em",
      "transition:all 0.2s ease",
      "cursor:pointer",
    ].filter(Boolean);

    const elementAttrs = {
      href: attrs.href || undefined,
      target: attrs.href ? "_blank" : undefined,
      rel: attrs.href ? "noopener noreferrer" : undefined,
      style: buttonStyles.join(";"),
      "data-variant": attrs.variant,
      "data-width": attrs.width,
    };

    return [
      "div",
      mergeAttributes({ "data-button": "", style: wrapperStyle }),
      [
        "a",
        mergeAttributes(elementAttrs),
        0,
      ],
    ];
  },
});

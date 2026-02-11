import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export type ImageAlignment = "left" | "center" | "right";

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => element.getAttribute("data-width") || element.getAttribute("width") || "100%",
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return {
            "data-width": attributes.width,
          };
        },
      },
      align: {
        default: "center" as ImageAlignment,
        parseHTML: (element) =>
          (element.getAttribute("data-align") as ImageAlignment) || "center",
        renderHTML: (attributes) => {
          if (!attributes.align) return {};
          return {
            "data-align": attributes.align,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { align = "center", width = "100%" } = HTMLAttributes as {
      align?: ImageAlignment;
      width?: string;
    };

    const styleParts = [
      `width:${width}`,
      "height:auto",
      "display:block",
      "border-radius:0.75rem",
      "margin:1.5rem auto",
    ];

    if (align === "left") {
      styleParts.push("margin-right:auto", "margin-left:0");
    } else if (align === "right") {
      styleParts.push("margin-left:auto", "margin-right:0");
    }

    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: styleParts.join(";"),
      }),
    ];
  },
});

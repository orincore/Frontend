import type { JSONContent } from "@tiptap/core";

export interface LandingContentSettings {
  maxWidth: number;
  paddingX: number;
  paddingY: number;
  backgroundColor: string;
}

export interface LandingContent {
  doc: JSONContent;
  settings: LandingContentSettings;
}

export const DEFAULT_CONTENT_SETTINGS: LandingContentSettings = {
  maxWidth: 1280,
  paddingX: 16,
  paddingY: 32,
  backgroundColor: "#FFFFFF",
};

export function normalizeLandingContent(
  value: any,
  overrides?: Partial<LandingContentSettings>
): LandingContent {
  if (value && typeof value === "object" && "doc" in value && value.doc) {
    return {
      doc: value.doc,
      settings: {
        ...DEFAULT_CONTENT_SETTINGS,
        ...value.settings,
        ...overrides,
      },
    };
  }

  if (value && typeof value === "object" && value.type === "doc") {
    return {
      doc: value,
      settings: {
        ...DEFAULT_CONTENT_SETTINGS,
        ...overrides,
      },
    };
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed?.type === "doc") {
        return {
          doc: parsed,
          settings: {
            ...DEFAULT_CONTENT_SETTINGS,
            ...overrides,
          },
        };
      }
    } catch (e) {
      // ignore parse error and fall through
    }
  }

  return {
    doc: {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
    },
    settings: {
      ...DEFAULT_CONTENT_SETTINGS,
      ...overrides,
    },
  };
}

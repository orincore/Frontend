"use client";

import React, { useEffect, useMemo, useState } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { ResizableImage } from "@/lib/tiptap/extensions/resizable-image";
import { CustomButton } from "@/lib/tiptap/extensions/custom-button";
import {
  TwoColumnSection,
  ColumnMedia,
  ColumnContent,
} from "@/lib/tiptap/extensions/two-column";
import { PageSection } from "@/lib/tiptap/extensions/page-section";
import {
  normalizeLandingContent,
  DEFAULT_CONTENT_SETTINGS,
  type LandingContentSettings,
} from "@/lib/tiptap/content";

interface DynamicPageRendererProps {
  content: any;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  title: string;
}

const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4] },
  }),
  ResizableImage.configure({
    HTMLAttributes: {
      class: "rounded-lg max-w-full",
    },
  }),
  Link.configure({
    openOnClick: true,
    HTMLAttributes: {
      class: "underline cursor-pointer",
    },
  }),
  Youtube.configure({
    HTMLAttributes: {
      class: "w-full aspect-video rounded-lg",
    },
    width: 640,
    height: 360,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Underline,
  Color,
  TextStyle,
  Highlight.configure({
    multicolor: true,
  }),
  CustomButton,
  TwoColumnSection,
  ColumnMedia,
  ColumnContent,
  PageSection,
];

export function DynamicPageRenderer({
  content,
  theme,
  title,
}: DynamicPageRendererProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Normalize content to extract doc + settings
  const normalized = useMemo(() => normalizeLandingContent(content), [content]);
  const settings: LandingContentSettings = {
    ...DEFAULT_CONTENT_SETTINGS,
    ...normalized.settings,
  };
  const doc = normalized.doc;

  const html = useMemo(() => {
    if (!isClient) return "";
    try {
      if (doc && typeof doc === "object" && doc.type === "doc") {
        return generateHTML(doc, extensions);
      }
      if (typeof content === "string") {
        return content;
      }
    } catch (e) {
      console.error("Failed to render page content:", e);
    }
    return "<p>Failed to load page content.</p>";
  }, [doc, content, isClient]);

  const safeHtml = html || "<p>Failed to load page content.</p>";

  // Use settings background if set, otherwise fall back to theme background
  const pageBg = settings.backgroundColor !== "#FFFFFF"
    ? settings.backgroundColor
    : (theme.background || "#FFFFFF");

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: pageBg }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dynamic-page a { color: ${theme.primary}; }
            .dynamic-page a:hover { color: ${theme.secondary}; }
            .dynamic-page h1, .dynamic-page h2, .dynamic-page h3, .dynamic-page h4 {
              color: ${theme.primary};
              font-family: 'Playfair Display', serif;
            }
            .dynamic-page h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.2; }
            .dynamic-page h2 { font-size: 2rem; font-weight: 700; margin-bottom: 0.75rem; margin-top: 2rem; line-height: 1.25; }
            .dynamic-page h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1.5rem; line-height: 1.3; }
            .dynamic-page h4 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; }
            .dynamic-page p { margin-bottom: 1rem; line-height: 1.75; color: #374151; }
            .dynamic-page ul, .dynamic-page ol { margin-bottom: 1rem; padding-left: 1.5rem; }
            .dynamic-page ul { list-style-type: disc; }
            .dynamic-page ol { list-style-type: decimal; }
            .dynamic-page li { margin-bottom: 0.25rem; line-height: 1.75; color: #374151; }
            .dynamic-page blockquote {
              border-left: 4px solid ${theme.accent};
              padding-left: 1rem;
              margin: 1.5rem 0;
              font-style: italic;
              color: #6B7280;
            }
            .dynamic-page img {
              height: auto;
              border-radius: 0.75rem;
            }
            .dynamic-page hr {
              border: none;
              border-top: 2px solid ${theme.accent}33;
              margin: 2rem 0;
            }
            .dynamic-page pre {
              background: #1F2937;
              color: #F9FAFB;
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 1rem 0;
            }
            .dynamic-page code {
              background: ${theme.primary}10;
              color: ${theme.primary};
              padding: 0.125rem 0.375rem;
              border-radius: 0.25rem;
              font-size: 0.875rem;
            }
            .dynamic-page pre code {
              background: none;
              color: inherit;
              padding: 0;
            }
            .dynamic-page iframe {
              width: 100%;
              aspect-ratio: 16/9;
              border-radius: 0.75rem;
              margin: 1.5rem 0;
            }
            .dynamic-page div[data-youtube-video] {
              margin: 1.5rem 0;
            }
            .dynamic-page div[data-youtube-video] iframe {
              width: 100%;
              aspect-ratio: 16/9;
              border-radius: 0.75rem;
            }
            .dynamic-page div[data-button] a:hover {
              opacity: 0.9;
              transform: translateY(-1px);
            }
            .dynamic-page section[data-page-section] {
              margin: 0;
            }
            .dynamic-page section[data-page-section] h1,
            .dynamic-page section[data-page-section] h2,
            .dynamic-page section[data-page-section] h3,
            .dynamic-page section[data-page-section] h4 {
              color: inherit;
            }
            .dynamic-page section[data-page-section] p,
            .dynamic-page section[data-page-section] li,
            .dynamic-page section[data-page-section] blockquote {
              color: inherit;
            }
            .dynamic-page div[data-two-col] {
              flex-wrap: wrap;
            }
            .dynamic-page div[data-col-media] img,
            .dynamic-page div[data-col-media] iframe {
              width: 100%;
              height: auto;
              border-radius: 0.75rem;
            }
            .dynamic-page div[data-col-content] h1,
            .dynamic-page div[data-col-content] h2,
            .dynamic-page div[data-col-content] h3 {
              color: ${theme.primary};
            }
            @media (max-width: 768px) {
              .dynamic-page h1 { font-size: 1.875rem; }
              .dynamic-page h2 { font-size: 1.5rem; }
              .dynamic-page h3 { font-size: 1.25rem; }
              .dynamic-page div[data-two-col] {
                flex-direction: column !important;
              }
              .dynamic-page div[data-col-media],
              .dynamic-page div[data-col-content] {
                flex: unset !important;
                width: 100% !important;
              }
            }
          `,
        }}
      />
      <article
        className="dynamic-page mx-auto"
        style={{
          maxWidth: `${settings.maxWidth}px`,
          padding: `${settings.paddingY}px ${settings.paddingX}px`,
        }}
        dangerouslySetInnerHTML={{ __html: isClient ? safeHtml : "<p>Loading...</p>" }}
      />
    </div>
  );
}

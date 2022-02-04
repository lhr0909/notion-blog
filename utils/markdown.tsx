import React from "react";
import Image from "next/image";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import parse from "html-react-parser";

export function renderMarkdown(markdown: string): string {
  return MarkdownIt({
    linkify: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }

      return ""; // use external default escaping
    },
  }).render(markdown);
}

export function renderHtml(html: string) {
  return parse(html, {
    replace: (domNode: any) => {
      if (domNode.type === "tag" && domNode.name === "img") {
        const img = domNode;
        return (
          <span className="next-image-wrapper">
            <Image
              className="next-image"
              src={img.attribs?.src}
              layout="fill"
              objectFit="contain"
              alt={img.attribs?.alt}
            />
          </span>
        );
      }
    },
  });
}

import React from "react";
import Image from "next/image";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import parse from "html-react-parser";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
  const client = new S3Client({
    region: 'us-west-2',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || 'invalidKey',
      secretAccessKey: process.env.S3_SECRET_KEY || 'invalidSecret',
    },
  });

  return parse(html, {
    replace: (domNode: any) => {
      if (domNode.type === "tag" && domNode.name === "img") {
        const img = domNode;

        let src = img.attribs?.src;
        const url = new URL(src);

        if (typeof window === 'undefined') {
          // download image then upload to s3
          fetch(src)
            .then((res) => res.blob())
            .then(async (blob: Blob) => {
              console.log(blob);

              const buffer = Buffer.from(await blob.arrayBuffer());

              // upload to s3
              const uploadParams = {
                Bucket: 'assets.divby0.io',
                Key: url.pathname.slice(1),
                Body: buffer,
                ACL: 'public-read',
                ContentType: blob.type,
                ContentLength: blob.size,
              };

              return client.send(new PutObjectCommand(uploadParams));
            });
        }

        return (
          <span className="next-image-wrapper">
            <Image
              className="next-image"
              src={`https://s3.us-west-2.amazonaws.com/assets.divby0.io${url.pathname}`}
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

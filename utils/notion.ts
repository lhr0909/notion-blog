import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const n2m = new NotionToMarkdown({
  notionClient: notion,
});

n2m.setCustomTransformer('video', (block: any) => {
  const client = new S3Client({
    region: 'us-west-2',
    // credentials: {
    //   accessKeyId: process.env.S3_ACCESS_KEY || 'invalidKey',
    //   secretAccessKey: process.env.S3_SECRET_KEY || 'invalidSecret',
    // },
  });

  const { video } = block;
  if (video.type === 'file') {
    const src = video.file?.url;
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

    // video tag with source and controls
    return `<video controls><source src="https://s3.us-west-2.amazonaws.com/assets.divby0.io${url.pathname}" type="video/mp4"></video>`;
  }

  if (video.type === 'external') {
    return `<video controls><source src="${video.external?.url}" type="video/mp4"></video>`;
  }

  // otherwise, skip
  return `${JSON.stringify(video)}`;
});

export function getText(object: any, defaultText?: string | null): string {
  return (object.map((t: any) => t?.text?.content || "").join("")) || defaultText;
}

export async function getSiteTitle(): Promise<string> {
  const response: any = await notion.databases.retrieve({
    database_id: process.env.NOTION_BLOG_DB!,
  });

  return getText(response.title, "Blog");
}

export async function getAllPosts(page_size = 100, recursive = true, start_cursor?: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_BLOG_DB!,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
    sorts: [{
      property: "Date",
      direction: "descending",
    }],
    start_cursor,
    page_size,
  });

  while (recursive && response.has_more) {
    const nextPage = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DB!,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [{
        property: "Date",
        direction: "descending",
      }],
      start_cursor: response.next_cursor || undefined,
      page_size,
    });

    response.results = [...response.results, ...nextPage.results];
    response.has_more = nextPage.has_more;
    response.next_cursor = nextPage.next_cursor;
  }

  return response;
}

export async function getPageIdFromSlug(slug: string): Promise<string> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_BLOG_DB!,
    filter: {
      property: "Slug",
      rich_text: {
        equals: slug,
      },
    },
    sorts: [{
      property: "Date",
      direction: "descending",
    }],
  });

  if (response.results.length === 0) {
    throw new Error(`No page found for slug ${slug}`);
  }

  return response.results[0].id;
}

export async function getPostContentMarkdown(pageId: string): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  return n2m.toMarkdownString(mdBlocks);
}

export async function getPageObject(page_id: string) {
  return notion.pages.retrieve({
    page_id,
  });
}

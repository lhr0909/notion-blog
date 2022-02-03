import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const n2m = new NotionToMarkdown({
  notionClient: notion,
});

export function getText(object: any, defaultText?: string): string {
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
      text: {
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

import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import classNames from "classnames";
import { DiscussionEmbed } from "disqus-react";
// import { format } from 'date-fns';

import {
  getAllPosts,
  getPageIdFromSlug,
  getPageObject,
  getPostContentMarkdown,
  getSiteTitle,
  getText,
} from "../../utils/notion";
import { renderHtml, renderMarkdown } from "../../utils/markdown";

import { Layout } from "../../components/Layout";

import "highlight.js/styles/agate.css";

interface DocProps {
  siteTitle: string;
  postTitle: string;
  __html: string;
  createdAt: string;
  oldUrl: string | null;
  createdBy: string;
}

const proseClassNames = classNames(
  "prose",
  "prose-slate",
  "md:prose-lg",
  "prose-a:text-blue-500",
  "hover:prose-a:underline",
  "prose-a:no-underline",
  "prose-a:font-normal",
  "prose-p:my-3",
  "md:prose-p:my-4",
);

const Doc: NextPage<DocProps> = ({
  siteTitle,
  postTitle,
  createdAt,
  createdBy,
  __html,
  oldUrl,
}) => {
  return (
    <>
      <Head>
        <title>
          {postTitle} - {siteTitle}
        </title>
      </Head>
      <Layout siteTitle={siteTitle}>
        <h1 className="text-2xl font-medium inline-block">{postTitle}</h1>
        <div className="text-gray-500 text-sm mt-1">
          {`${createdAt} ${createdBy}`}
        </div>
        <article
          className={proseClassNames}
        >
          {renderHtml(__html)}
        </article>
        <DiscussionEmbed
          shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!}
          config={{
            url: oldUrl || undefined,
          }}
        />
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();

  const paths = posts.results.map((post: any) => ({
    params: {
      slug: getText(post.properties.Slug?.rich_text),
    },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<DocProps> = async (context) => {
  const siteTitle = await getSiteTitle();

  const { params } = context;
  const { slug } = params!;

  const pageId = await getPageIdFromSlug(slug as string);

  const postContent = await getPostContentMarkdown(pageId);
  const postMetadata: any = await getPageObject(pageId);

  const postTitle = getText(postMetadata.properties.Name.title);
  const __html = renderMarkdown(postContent);

  return {
    props: {
      siteTitle,
      postTitle: postTitle as string,
      createdAt: (postMetadata.properties.Date?.date?.start ||
        postMetadata.created_time) as string,
      createdBy: postMetadata.properties.Author?.people
        .map((p: any) => p.name)
        .join(", "),
      // props needs to be null
      oldUrl: getText(postMetadata.properties.OldURL?.rich_text, null),
      __html,
    },
    revalidate: 60,
  };
};

export default Doc;

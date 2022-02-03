import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import classNames from "classnames";
import { DiscussionEmbed } from "disqus-react";
// import { format } from 'date-fns';

import {
  getAllPosts,
  getPageObject,
  getPostContentMarkdown,
  getSiteTitle,
  getText,
} from "../../../utils/notion";
import { renderMarkdown } from "../../../utils/markdown";

import { Layout } from "../../../components/Layout";

import "highlight.js/styles/agate.css";

interface DocProps {
  siteTitle: string;
  postTitle: string;
  __html: string;
  createdAt: string;
  oldUrl?: string;
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
  "md:prose-p:my-4"
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
          dangerouslySetInnerHTML={{ __html }}
        />
        <DiscussionEmbed
          shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME!}
          config={{
            url: oldUrl,
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
      id: post.id,
      slug: [getText(post.properties.Slug?.rich_text)],
    },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<DocProps> = async (context) => {
  const siteTitle = await getSiteTitle();

  const { params } = context;
  const { id } = params!;

  const postContent = await getPostContentMarkdown(id as string);
  const postMetadata: any = await getPageObject(id as string);

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
      oldUrl: getText(postMetadata.properties.OldURL?.rich_text),
      __html,
    },
    revalidate: 600,
  };
};

export default Doc;

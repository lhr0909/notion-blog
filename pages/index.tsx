import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

import { getAllPosts, getPostContentMarkdown, getSiteTitle, getText } from "../utils/notion";
import { Layout } from "../components/Layout";
import { renderMarkdown } from "../utils/markdown";
// import { format } from "date-fns";

interface HomeProps {
  siteTitle: string;
  introHtml: string;
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    date: string;
  }>;
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

const Home: NextPage<HomeProps> = ({ siteTitle, introHtml, posts }) => {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Layout siteTitle={siteTitle}>
        <Image className="rounded" src="/simonliang.jpg" alt="logo" width={120} height={120} />
        <article
          className={proseClassNames}
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
        <h1 className="text-2xl font-medium inline-block my-4">Blog Posts</h1>
        {posts.map((post) => {
          return (
            <h3 key={post.id}>
              <Link href={`/posts/${post.slug}`} passHref>
                <a className="text-blue-500 hover:underline text-lg">
                  {post.title}
                </a>
              </Link>
              <span className="text-gray-500 text-sm ml-2">
                {post.date}
              </span>
            </h3>
          );
        })}
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async (context) => {
  const siteTitle = await getSiteTitle();
  const posts = await getAllPosts();

  const introHtml = renderMarkdown(await getPostContentMarkdown(process.env.NOTION_INTRO_PAGE!));

  return {
    props: {
      siteTitle,
      introHtml,
      posts: posts.results.map((post: any) => ({
        id: post.id,
        title: getText(post.properties.Name.title),
        slug: getText(post.properties.Slug?.rich_text),
        date: post.properties.Date?.date?.start || post.created_time,
        // TODO: tags
      })),
    },
    revalidate: 60,
  };
};

export default Home;

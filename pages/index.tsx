import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { getAllPosts, getSiteTitle, getText } from "../utils/notion";
import { Layout } from "../components/Layout";
// import { format } from "date-fns";

interface HomeProps {
  siteTitle: string;
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    date: string;
  }>;
}

const Home: NextPage<HomeProps> = ({ siteTitle, posts }) => {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Layout siteTitle={siteTitle}>
        {posts.map((post) => {
          return (
            <h3 key={post.id}>
              <Link href={`/posts/${post.id}/${post.slug}`} passHref>
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

  return {
    props: {
      siteTitle,
      posts: posts.results.map((post: any) => ({
        id: post.id,
        title: getText(post.properties.Name.title),
        slug: getText(post.properties.Slug?.rich_text),
        date: post.properties.Date?.date?.start || post.created_time,
        // TODO: tags
      })),
    },
    revalidate: 600,
  };
};

export default Home;

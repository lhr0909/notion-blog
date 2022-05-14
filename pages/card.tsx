import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import classNames from "classnames";

import { Layout } from "../components/Layout";
import useQRCode from "components/useQRCode";
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
  const { QRCode, openQRCode } = useQRCode({
    url: "https://work.weixin.qq.com/kfid/kfcfc625b727296f5e5?enc_scene=ENCUiCPtMzG1dpsURvMjb7mXJ",
    description: "微信扫码联系我",
    btnTitleMobile: "点击联系我",
  });

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Layout siteTitle={siteTitle}>
        <Image
          className="rounded"
          src="/simonliang.jpg"
          alt="logo"
          width={120}
          height={120}
        />
        <article className={proseClassNames}>
          <h2>大家好，我是西门良Simon Liang！</h2>
          <p>
            如果需要联系我的话，请大家用微信扫描以下二维码，并给我留言，我收到之后会第一时间回复。
          </p>
          <div className="rounded-md shadow">
            <button
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base cursor-pointer font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              onClick={() => openQRCode()}
            >
              开始试用
            </button>
          </div>
        </article>
        <QRCode />
      </Layout>
    </>
  );
};

export default Home;

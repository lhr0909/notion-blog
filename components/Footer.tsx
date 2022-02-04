import Link from "next/link";
import React from "react";

import GithubIcon from "./icons/GitHubIcon";
import LinkedInIcon from "./icons/LinkedInIcon";
import TwitterIcon from "./icons/TwitterIcon";
import YoutubeIcon from "./icons/YouTubeIcon";
import BilibiliIcon from "./icons/BilibiliIcon";

export const Footer: React.FC<{}> = () => {
  return (
    <footer className="text-gray-500 font-extralight my-8 flex flex-col sm:flex-row sm:justify-between">
      <span className="block">Copyright (c) 2022 Simon Liang</span>
      <span className="flex flex-row mt-2 sm:mt-0">
        <Link href="/links/github" passHref>
          <a
            className="hover:text-blue-500 mr-1"
            target="_blank"
            rel="noopener"
          >
            <GithubIcon className="h-6 w-6" />
          </a>
        </Link>
        <Link href="/links/twitter" passHref>
          <a
            className="hover:text-blue-500 mx-1"
            target="_blank"
            rel="noopener"
          >
            <TwitterIcon className="h-6 w-6" />
          </a>
        </Link>
        <Link href="/links/linkedin" passHref>
          <a
            className="hover:text-blue-500 mx-1"
            target="_blank"
            rel="noopener"
          >
            <LinkedInIcon className="h-6 w-6" />
          </a>
        </Link>
        <Link
          href="/links/youtube"
          passHref
        >
          <a
            className="hover:text-blue-500 mx-1"
            target="_blank"
            rel="noopener"
          >
            <YoutubeIcon className="h-6 w-6" />
          </a>
        </Link>
        <Link
          href="/links/bilibili"
          passHref
        >
          <a
            className="hover:text-blue-500 ml-1"
            target="_blank"
            rel="noopener"
          >
            <BilibiliIcon className="h-6 w-6" />
          </a>
        </Link>
      </span>
    </footer>
  );
};

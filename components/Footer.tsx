import Link from "next/link";
import React from "react";

import GithubIcon from "./icons/GitHubIcon";
import LinkedInIcon from "./icons/LinkedInIcon";
import TwitterIcon from "./icons/TwitterIcon";

export const Footer: React.FC<{}> = () => {
  return (
    <footer className="text-gray-500 font-extralight mt-8 flex flex-col sm:flex-row sm:justify-between">
      <span className="block">
        Copyright (c) 2022 Simon Liang
      </span>
      <span className="flex flex-row mt-2 sm:mt-0">
        <Link href="https://github.com/lhr0909" passHref>
          <a className="hover:text-blue-500 mr-1" target="_blank" rel="noopener">
            <GithubIcon className="h-6 w-6" />
          </a>
        </Link>
        <Link href="https://twitter.com/lhr0909" passHref>
          <a className="hover:text-blue-500 mx-1" target="_blank" rel="noopener">
            <TwitterIcon className="h-6 w-6" />
          </a>
        </Link>
        <Link href="https://www.linkedin.com/in/simon-liang" passHref>
          <a className="hover:text-blue-500 ml-1" target="_blank" rel="noopener">
            <LinkedInIcon className="h-6 w-6" />
          </a>
        </Link>
      </span>
    </footer>
  );
};

import React from "react";
import Link from "next/link";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <nav className="my-6 flex flex-col sm:flex-row sm:justify-between">
      <Link href="/" passHref legacyBehavior>
        <a>
          <h2 className="hover:underline text-lg font-medium inline-block">{title}</h2>
        </a>
      </Link>
      {/* <div className="leading-8 inline-block">
        <Link href="/" passHref legacyBehavior>
          <a className="text-blue-500 hover:underline">
            Blog Posts
          </a>
        </Link>
      </div> */}
    </nav>
  );
};

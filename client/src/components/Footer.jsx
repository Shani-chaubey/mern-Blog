import React from "react";
import { Footer, FooterLink, FooterLinkGroup } from "flowbite-react";
import { Link } from "react-router-dom";

export default function FooterCom() {
  return (
    <Footer container className="flex justify-center border border-t-8 border-teal-500">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Himanshu's
        </span>
        Blogs
      </Link>
    </Footer>
  );
}

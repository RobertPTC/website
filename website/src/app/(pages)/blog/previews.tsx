"use client";

import { useState } from "react";

import BlogPost from "./blog-post";
import Directory from "./directory";

export default function BlogPreviews() {
  const [activePost, setActivePost] = useState<string>("");
  function onPostClick(postName: string) {
    setActivePost(postName);
  }
  return (
    <>
      <Directory onPostClick={onPostClick} />
      <BlogPost activePost={activePost} />
    </>
  );
}

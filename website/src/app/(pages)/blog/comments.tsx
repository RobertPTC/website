"use client";
import { useEffect, useState } from "react";

import { BlogComment } from "@app/app/api/types";

const blogComments = [
  { id: 1, respondsTo: 0 },
  { id: 2, respondsTo: 0 },
  { id: 3, respondsTo: 0 },
  { id: 4, respondsTo: 1 },
  { id: 5, respondsTo: 2 },
  { id: 6, respondsTo: 1 },
  { id: 7, respondsTo: 3 },
  { id: 8, respondsTo: 3 },
  { id: 9, respondsTo: 7 },
  { id: 10, respondsTo: 7 },
  { id: 11, respondsTo: 5 },
  { id: 12, respondsTo: 6 },
  { id: 13, respondsTo: 0 },
  { id: 14, respondsTo: 12 },
];

const blogGraph: { [key: number]: { children: any[] } } = {
  0: { children: [] },
};

blogComments.forEach((c) => {
  if (!blogGraph[c.id]) {
    blogGraph[c.id] = {
      children: [],
    };
  }
  blogGraph[c.respondsTo].children.push(c);
});

export default function Comments({ blogID }: { blogID: string }) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  useEffect(() => {
    async function getComments() {
      const res = await fetch(`/api/comments/${blogID}`);
      const comments = await res.json();
      // setComments(comments);
      console.log("comments ", comments);
      setComments(comments);
    }
    getComments();
  }, [blogID]);
  useEffect(() => {
    function exploreBlogGraph(v: any, container?: HTMLDivElement) {
      if (typeof document !== "undefined") {
        let c = container;
        if (!c) {
          c = document.createElement("div");
        }
        c.setAttribute("id", v.id);
        let seen: any = {};
        blogGraph[v.id].children.forEach((v) => {
          if (!seen[v.id]) {
            const node = document.createElement("div");
            node.setAttribute("id", v.id);
            if (!c) return;
            seen[v.id] = true;
            c.append(exploreBlogGraph(v, node));
          }
        });
        return c;
      }
      return "";
    }
    console.log(exploreBlogGraph({ id: 0 }));
  }, [comments]);

  return (
    <>
      {comments.map((c) => {
        return <></>;
      })}
    </>
  );
}

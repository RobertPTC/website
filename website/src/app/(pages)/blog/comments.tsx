"use client";
import { useEffect } from "react";

export default function Comments({ blogID }: { blogID: string }) {
  useEffect(() => {
    async function getComments() {
      const comments = await fetch(`/api/comments/${blogID}`);
      console.log("comments ", comments);
    }
    getComments();
  }, [blogID]);

  return <></>;
}

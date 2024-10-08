"use client";
import { useEffect, useState } from "react";

import { Typography } from "@mui/material";
import dayjs from "dayjs";

import { BlogComment } from "@app/app/api/types";

function exploreBlogGraph(
  v: BlogComment,
  blogID: string,
  blogGraph: { [key: string]: { children: BlogComment[] } },
  container?: HTMLDivElement
) {
  if (typeof document === "undefined") return "";
  let c = container;
  if (!c) {
    c = document.createElement("div");
  }
  c.setAttribute("id", v.blog_comment_id);
  let seen: any = {};
  blogGraph[v.blog_comment_id].children.forEach((comment) => {
    if (seen[v.blog_comment_id]) return;

    const node = document.createElement("div");
    node.setAttribute("id", comment.blog_comment_id);

    const date = document.createElement("p");
    date.textContent = comment.date;

    const text = document.createElement("p");
    text.textContent = comment.text;

    const reply = document.createElement("button");
    reply.classList.add("reply-to-button");
    reply.setAttribute("data-responds-to", comment.blog_comment_id);
    reply.textContent = "Reply";

    const replyForm = document.createElement("form");
    replyForm.setAttribute("data-reply-form", comment.blog_comment_id);
    replyForm.classList.add("hidden-reply-form");

    const textInput = document.createElement("input");
    textInput.setAttribute("name", "text");
    replyForm.appendChild(textInput);

    const respondsToInput = document.createElement("input");
    respondsToInput.setAttribute("type", "hidden");
    respondsToInput.setAttribute("value", comment.blog_comment_id);
    respondsToInput.setAttribute("name", "responds_to");
    replyForm.appendChild(respondsToInput);

    const submitButton = document.createElement("button");
    submitButton.setAttribute("type", "submit");
    submitButton.textContent = "Reply";
    replyForm.appendChild(submitButton);

    const replyContainer = document.createElement("div");

    const repliesContainer = document.createElement("button");
    repliesContainer.setAttribute("data-replies-for", comment.blog_comment_id);

    replyContainer.appendChild(date);
    replyContainer.appendChild(text);
    replyContainer.appendChild(reply);
    replyContainer.appendChild(replyForm);

    node.appendChild(replyContainer);
    node.appendChild(repliesContainer);

    if (!c) return;

    seen[comment.blog_comment_id] = true;
    c.appendChild(
      exploreBlogGraph(comment, blogID, blogGraph, node) ||
        document.createElement("div")
    );
  });
  return c;
}

export default function Comments({ blogID }: { blogID: string }) {
  const [commentsGraph, setCommentsGraph] = useState<HTMLDivElement>();
  const [comments, setComments] = useState<BlogComment[]>();
  const [commentsCount, setCommentsCount] = useState<number | null>(null);
  useEffect(() => {
    async function getCommentsCount() {
      const res = await fetch(`/api/comments/${blogID}/count`);
      const { count } = await res.json();
      setCommentsCount(count);
    }
    async function getComments() {
      const res = await fetch(`/api/comments/${blogID}`);
      const comments: BlogComment[] = await res.json();
      const blogGraph: { [key: string]: { children: BlogComment[] } } = {
        [blogID]: { children: [] },
      };
      comments.forEach((c) => {
        if (!blogGraph[c.blog_comment_id]) {
          blogGraph[c.blog_comment_id] = {
            children: [],
          };
        }
        blogGraph[c.responds_to].children.push(c);
      });
      const blogNode = exploreBlogGraph(
        {
          responds_to: "",
          blog_comment_id: blogID,
          date: "",
          text: "",
          journalist_id: "",
        },
        blogID,
        blogGraph
      );
      if (blogNode) {
        setComments(comments);
        setCommentsGraph(blogNode);
      }
    }
    getComments();
    getCommentsCount();
  }, [blogID]);

  useEffect(() => {
    async function onReplySubmit(this: HTMLFormElement, e: Event) {
      e.preventDefault();
      const formData = new FormData(this);
      formData.append("date", dayjs().format("MM/DD/YYYY"));
      const res = await fetch("/api/comments/create-comment", {
        method: "POST",
        body: formData,
      });
    }
    function onClickReplyToButton(this: HTMLButtonElement) {
      const replyForm = this.nextElementSibling;
      if (replyForm) {
        replyForm.classList.toggle("hidden-reply-form");
      }
    }
    function onClickRepliesButton(this: HTMLButtonElement) {
      const commentID = this.dataset["repliesFor"];
      console.log("blogID ", commentID);
      const replyContainer = document.querySelector(
        `[data-reply="${commentID}"]`
      );
      if (replyContainer) {
        replyContainer.classList.toggle("hidden-replies");
      }
    }
    if (commentsGraph && typeof document !== "undefined") {
      const replyToButtons = document.querySelectorAll("[data-responds-to]");
      const replyForms = document.querySelectorAll("[data-reply-form]");
      const repliesButtons = document.querySelectorAll("[data-replies-for]");
      Array.from(replyForms).forEach((f) => {
        f.addEventListener("submit", onReplySubmit);
      });
      Array.from(replyToButtons).forEach((b) => {
        b.addEventListener("click", onClickReplyToButton);
      });
      Array.from(repliesButtons).forEach((b) => {
        const repliesFor = (b as HTMLButtonElement).dataset.repliesFor;
        fetch(`/api/comments/${repliesFor}/count`).then((res) =>
          res.json().then(({ count }) => {
            b.textContent = `${count} ${count > 1 ? "replies" : "reply"}`;
          })
        );
        b.addEventListener("click", onClickRepliesButton);
      });
      return () => {
        Array.from(replyForms).forEach((f) => {
          f.removeEventListener("submit", onReplySubmit);
        });
        Array.from(replyToButtons).forEach((b) => {
          b.removeEventListener("click", onClickReplyToButton);
        });
        Array.from(repliesButtons).forEach((b) => {
          b.removeEventListener("click", onClickRepliesButton);
        });
      };
    }
  }, [commentsGraph]);
  if (!commentsGraph || !comments) return <></>;
  return (
    <>
      <Typography variant="h2" sx={{ fontSize: "20px", fontWeight: 500 }}>
        {commentsCount} Comments
      </Typography>
      <div
        dangerouslySetInnerHTML={{ __html: commentsGraph.innerHTML || "" }}
      />
    </>
  );
}

"use client";
import { useEffect, useState } from "react";

import { Typography } from "@mui/material";
import dayjs from "dayjs";

import { BlogComment, BlogCommentTree } from "@app/app/api/types";

// async function getCommentsCount() {
//   const res = await fetch(`/api/blogs/${blogID}/comments/count`);
//   const { count } = await res.json();
//   setCommentsCount(count);
// }
// async function getComments() {
//   const res = await fetch(`/api/blogs/${blogID}/comments`);
//   const comments: BlogComment[] = await res.json();
//   const blogGraph: { [key: string]: { children: BlogComment[] } } = {
//     [blogID]: { children: [] },
//   };
//   comments.forEach((c) => {
//     if (!blogGraph[c.blog_comment_id]) {
//       blogGraph[c.blog_comment_id] = {
//         children: [],
//       };
//     }
//     blogGraph[c.responds_to].children.push(c);
//   });
//   const blogNode = exploreBlogGraph(
//     {
//       responds_to: "",
//       blog_comment_id: blogID,
//       date: "",
//       text: "",
//       journalist_id: "",
//     },
//     blogID,
//     blogGraph
//   );
//   if (blogNode) {
//     setComments(comments);
//     setCommentsGraph(blogNode);
//   }
// }

function ReplyButton(comment: BlogComment) {
  const reply = document.createElement("button");
  reply.classList.add("reply-to-button");
  reply.setAttribute("data-responds-to", comment.blog_comment_id);
  reply.textContent = "Reply";
  return reply;
}

function Container(comment: BlogComment) {
  const node = document.createElement("div");
  node.setAttribute("id", comment.blog_comment_id);
  return node;
}

function Date(comment: BlogComment) {
  const date = document.createElement("p");
  date.textContent = comment.date;
  return date;
}

function Text(comment: BlogComment) {
  const text = document.createElement("p");
  text.textContent = comment.text;
  return text;
}

function ReplyForm(comment: BlogComment) {
  const replyForm = document.createElement("form");
  replyForm.setAttribute("data-reply-form", comment.blog_comment_id);
  replyForm.classList.add("hidden-reply-form");
  return replyForm;
}

function ReplyInput(comment: BlogComment) {
  const textInput = document.createElement("input");
  textInput.setAttribute("name", "text");
  return textInput;
}

function RespondsToInput(comment: BlogComment) {
  const respondsToInput = document.createElement("input");
  respondsToInput.setAttribute("type", "hidden");
  respondsToInput.setAttribute("value", comment.blog_comment_id);
  respondsToInput.setAttribute("name", "responds_to");
  return respondsToInput;
}

function GetRepliesButton(comment: BlogComment) {
  const getRepliesButton = document.createElement("button");
  getRepliesButton.setAttribute(
    "data-get-replies-for",
    comment.blog_comment_id
  );
  return getRepliesButton;
}

function Reply(comment: BlogComment) {
  if (typeof document === "undefined") return null;
  const node = Container(comment);
  const date = Date(comment);
  const text = Text(comment);
  const replyButton = ReplyButton(comment);

  const replyForm = ReplyForm(comment);
  replyForm.appendChild(ReplyInput(comment));
  replyForm.appendChild(RespondsToInput(comment));

  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.textContent = "Reply";
  replyForm.appendChild(submitButton);

  const replies = document.createElement("div");
  replies.setAttribute("data-replies-for", comment.blog_comment_id);

  const repliesContainer = document.createElement("div");
  repliesContainer.appendChild(replies);

  const replyContainer = document.createElement("div");
  replyContainer.appendChild(date);
  replyContainer.appendChild(text);
  replyContainer.appendChild(replyButton);
  replyContainer.appendChild(replyForm);

  node.appendChild(replyContainer);
  node.appendChild(repliesContainer);

  return node;
}

function Comment(comment: BlogCommentTree) {
  if (typeof document === "undefined") return null;
  const node = Container(comment);
  const date = Date(comment);
  const text = Text(comment);
  const replyButton = ReplyButton(comment);

  const replyForm = ReplyForm(comment);
  replyForm.appendChild(ReplyInput(comment));
  replyForm.appendChild(RespondsToInput(comment));

  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.textContent = "Reply";
  replyForm.appendChild(submitButton);

  const getRepliesButton = GetRepliesButton(comment);
  getRepliesButton.setAttribute(
    "data-get-replies-for",
    comment.blog_comment_id
  );
  getRepliesButton.textContent = `${comment.reply_count} ${
    comment.reply_count > 1 ? "Replies" : "Reply"
  }`;

  const replies = document.createElement("div");
  replies.setAttribute("data-replies-for", comment.blog_comment_id);

  const repliesContainer = document.createElement("div");
  repliesContainer.appendChild(getRepliesButton);
  repliesContainer.appendChild(replies);

  const replyContainer = document.createElement("div");
  replyContainer.appendChild(date);
  replyContainer.appendChild(text);
  replyContainer.appendChild(replyButton);
  replyContainer.appendChild(replyForm);

  node.appendChild(replyContainer);
  node.appendChild(repliesContainer);

  return node;
}

function exploreBlogGraph(
  v: BlogCommentTree,
  blogID: string,
  blogGraph: { [key: string]: { children: BlogCommentTree[] } },
  componentFn: (btc: BlogCommentTree) => HTMLDivElement | null,
  container?: HTMLDivElement
) {
  if (typeof document === "undefined") return "";
  let c = container;
  if (!c) {
    c = document.createElement("div");
  }

  let seen: any = {};
  blogGraph[v.blog_comment_id].children.forEach((comment) => {
    if (seen[v.blog_comment_id]) return;
    const node = componentFn(comment);

    if (!c || !node) return;

    seen[comment.blog_comment_id] = true;
    c.appendChild(
      exploreBlogGraph(comment, blogID, blogGraph, componentFn, node) ||
        document.createElement("div")
    );
  });
  return c;
}

export default function Comments({
  blogID,
  initialComments,
  initialCommentsCount,
}: {
  blogID: string;
  initialComments: BlogCommentTree[];
  initialCommentsCount: number;
}) {
  const [commentsGraph, setCommentsGraph] = useState<HTMLDivElement>();
  const [comments, setComments] = useState<BlogCommentTree[]>(initialComments);
  const [commentsCount, setCommentsCount] = useState<number | null>(
    initialCommentsCount
  );
  useEffect(() => {
    const blogGraph: { [key: string]: { children: BlogCommentTree[] } } = {
      [blogID]: { children: [] },
    };
    comments.forEach(async (c) => {
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
        reply_count: 0,
      },
      blogID,
      blogGraph,
      Comment
    );
    if (blogNode) {
      setComments(comments);
      setCommentsGraph(blogNode);
    }
  }, [comments, blogID]);

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
    async function onClickRepliesButton(this: HTMLButtonElement) {
      try {
        const commentID = this.dataset["getRepliesFor"];
        if (!commentID) {
          throw new Error(`button missing id`);
        }
        const res = await fetch(`/api/comments/${commentID}/comments`);
        const json = await res.json();
        const repliesContainer: HTMLDivElement | null = document.querySelector(
          `[data-replies-for="${commentID}"]`
        );
        if (!repliesContainer) {
          throw new Error(`no replies container for ${commentID}`);
        }
        const blogGraph: { [key: string]: { children: BlogCommentTree[] } } = {
          [commentID]: { children: [] },
        };
        json.comments.forEach((c: BlogCommentTree) => {
          if (!blogGraph[c.blog_comment_id]) {
            blogGraph[c.blog_comment_id] = {
              children: [],
            };
          }
          blogGraph[c.responds_to].children.push(c);
        });
        exploreBlogGraph(
          {
            responds_to: "",
            blog_comment_id: commentID,
            date: "",
            text: "",
            journalist_id: "",
            reply_count: 0,
          },
          commentID,
          blogGraph,
          Reply,
          repliesContainer
        );
      } catch (error) {
        console.log("error ", error);
      }
    }
    if (commentsGraph && typeof document !== "undefined") {
      const replyToButtons = document.querySelectorAll("[data-responds-to]");
      const replyForms = document.querySelectorAll("[data-reply-form]");
      const repliesButtons = document.querySelectorAll(
        "[data-get-replies-for]"
      );

      Array.from(replyForms).forEach((f) => {
        f.addEventListener("submit", onReplySubmit);
      });
      Array.from(replyToButtons).forEach((b) => {
        b.addEventListener("click", onClickReplyToButton);
      });
      Array.from(repliesButtons).forEach((b) => {
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
        id={blogID}
        dangerouslySetInnerHTML={{ __html: commentsGraph.innerHTML || "" }}
      />
    </>
  );
}

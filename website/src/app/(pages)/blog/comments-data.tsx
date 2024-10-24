import { BlogComment, BlogCommentTree } from "@app/app/api/types";
import { db } from "@app/db";

import Comments from "./comments";

async function getComments(blogID: string) {
  try {
    const comments = await db.getCommentsForBlog(blogID);
    if (!comments) {
      return [];
    }
    return comments;
  } catch (error) {
    console.error("error ", error);
    return null;
  }
}

async function getCommentsCount(blogID: string) {
  try {
    const count = await db.getCommentsCountForBlog(blogID);
    if (count === null) {
      throw new Error("could not get count");
    }
    return count;
  } catch (error) {
    console.error("error ", error);
    return null;
  }
}

export default async function CommentsData({ blogID }: { blogID: string }) {
  const comments: BlogComment[] | null = await getComments(blogID);
  if (!comments) return <></>;
  const commentsCount = await getCommentsCount(blogID);
  const blogCommentTree: BlogCommentTree[] = await Promise.all(
    comments.map(async (c) => {
      const res = await fetch(
        `${process.env.API_URL}/comments/${c.blog_comment_id}/count`
      );
      const json = await res.json();
      return {
        ...c,
        reply_count: json.count,
      };
    })
  );
  if (!commentsCount) return <></>;
  return (
    <Comments
      blogID={blogID}
      initialComments={blogCommentTree}
      initialCommentsCount={commentsCount}
    />
  );
}

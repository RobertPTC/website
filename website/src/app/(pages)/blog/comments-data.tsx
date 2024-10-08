import { BlogComment, BlogCommentTree } from "@app/app/api/types";

import Comments from "./comments";

async function getComments(blogID: string) {
  const res = await fetch(`${process.env.API_URL}/blogs/${blogID}/comments`);
  const json = await res.json();
  return json;
}

async function getCommentsCount(blogID: string) {
  const res = await fetch(
    `${process.env.API_URL}/blogs/${blogID}/comments/count`
  );
  const json = await res.json();
  return json;
}

export default async function CommentsData({ blogID }: { blogID: string }) {
  const comments: BlogComment[] = await getComments(blogID);
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

  return (
    <Comments
      blogID={blogID}
      initialComments={blogCommentTree}
      initialCommentsCount={commentsCount.count}
    />
  );
}

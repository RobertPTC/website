import Comments from "./comments";

async function getComments(blogID: string) {
  const res = await fetch(`${process.env.API_URL}/blogs/${blogID}/comments`);
  const json = await res.json();
  return json;
}

export default async function CommentsData({ blogID }: { blogID: string }) {
  const comments = await getComments(blogID);
  console.log("comments ", comments);

  return <Comments blogID={blogID} initialComments={comments} />;
}

import { Grid } from "@mui/material";

import MainLayoutWithPadding from "app/components/main-layout-with-padding";

import { blogPosts, PostNames } from "../blogs";
import Directory from "../directory";

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((k) => ({
    post: k,
  }));
}

export default function Post({ params }: { params: { post: PostNames } }) {
  const Component = blogPosts[params.post];
  return (
    <MainLayoutWithPadding>
      <Grid container>
        <Grid item xs={3}>
          <Directory />
        </Grid>
        <Grid item xs={9}>
          <Component />
        </Grid>
      </Grid>
    </MainLayoutWithPadding>
  );
}

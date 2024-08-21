import { Grid } from "@mui/material";

import MainLayoutWithPadding from "app/components/main-layout-with-padding";

import Directory from "../directory";
import { blogPosts, PostNames } from "../blogs";

export default function Post({ params }: { params: { post: PostNames } }) {
  console.log("params.post ", params.post);
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

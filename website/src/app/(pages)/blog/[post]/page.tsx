import { Grid } from "@mui/material";

import MainLayoutWithPadding from "app/components/main-layout-with-padding";

import Directory from "../directory";

type PostNames =
  | "building-the-google-timer.post"
  | "building-the-blog-file-directory.post";

export default function Post({ params }: { params: { post: PostNames } }) {
  return (
    <MainLayoutWithPadding>
      <Grid container>
        <Grid item xs={3}>
          <Directory />
        </Grid>
        <Grid item xs={9}>
          {params.post}
        </Grid>
      </Grid>
    </MainLayoutWithPadding>
  );
}

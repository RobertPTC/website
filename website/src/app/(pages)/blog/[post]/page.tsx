import { Box, Grid } from "@mui/material";

import MainLayoutWithPadding from "components/main-layout-with-padding";

import { blogIndexes, blogPosts, PostNames } from "../blogs";
import Directory from "../directory";

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((k) => ({
    post: k,
  }));
}

export default function Post({ params }: { params: { post: PostNames } }) {
  const Component = blogPosts[params.post];
  const index = blogIndexes[params.post];
  return (
    <MainLayoutWithPadding>
      <Grid container>
        <Grid item xs={3}>
          <Box sx={{ position: "sticky", top: "60px" }}>
            <Directory />
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Component />
        </Grid>
        <Grid item xs={2}>
          <Box sx={{ px: 2, position: "sticky", top: "60px" }}>
            {index.map((id) => {
              return (
                <Box key={id} sx={{ mb: 0.5 }}>
                  <Box
                    component="a"
                    href={`#${id}`}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {id}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </MainLayoutWithPadding>
  );
}

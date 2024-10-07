import { Box, Grid } from "@mui/material";
import { Metadata } from "next";

import MainLayoutWithPadding from "components/main-layout-with-padding";

import {
  blogIndexes,
  blogPosts,
  PostNames,
  blogMetadata,
  blogPostToID,
} from "../blogs";
import Directory from "../directory";

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((k) => ({
    post: k,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { post: PostNames };
}): Promise<Metadata> {
  return blogMetadata[params.post];
}

export default function Post({ params }: { params: { post: PostNames } }) {
  const Component = blogPosts[params.post];
  const index = blogIndexes[params.post];
  if (!index || !Component) return <></>;
  return (
    <MainLayoutWithPadding>
      <Grid container>
        <Grid item xs={2} sx={{ display: ["none", "none", "block"] }}>
          <Box sx={{ position: "sticky", top: "60px" }}>
            <Directory />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Component />
        </Grid>
        <Grid item xs={2} sx={{ display: ["none", "none", "block"] }}>
          <Box sx={{ px: 2, position: "sticky", top: "60px" }}>
            {index.map((id) => {
              return (
                <Box key={id} sx={{ mb: 1.5 }}>
                  <Box
                    component="a"
                    href={`#${id}`}
                    sx={{ textTransform: "capitalize", fontSize: "1rem" }}
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

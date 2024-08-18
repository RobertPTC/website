//@ts-nocheck
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import { blogPreviews } from "./blogs";

var paths = [
  "About.vue",
  "Categories/Index.vue",
  "Categories/Demo.vue",
  "Categories/Flavors.vue",
  "Categories/Types/Index.vue",
  "Categories/Types/Other.vue",
];

function buildFileTree(files: string[]) {
  let result = [];
  files.forEach((element) => {
    let tmp = result;
    element.split("/").forEach((e) => {
      let i = tmp.find((o) => o.name === e);
      if (!i) {
        i = { name: e, children: [] };
        tmp.push(i);
      }
      tmp = i.children;
    });
  });
  return result;
}
buildFileTree(paths);

export default function BlogPreviews() {
  return (
    <Grid container>
      {JSON.stringify(buildFileTree(paths)[1].children)}
      {blogPreviews.map(({ title, previewText, date, imgURL }) => (
        <Grid item xs={4} key={title}>
          <Card variant="outlined">
            <CardActionArea>
              <CardContent>
                <Typography variant="h2" sx={{ fontSize: "35px", mb: 1 }}>
                  {title}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontSize: "21px", fontWeight: 100 }}
                >
                  {previewText}
                </Typography>
                <Box component="img" src={imgURL} />
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import { blogPreviews } from "./blogs";

export default function BlogPreviews() {
  return (
    <Grid container>
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

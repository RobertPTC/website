import {
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
                <Typography variant="h2">{title}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

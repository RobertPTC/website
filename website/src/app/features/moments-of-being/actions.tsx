import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function Actions() {
  return (
    <>
      <Link href="/moments-of-being/create-moment">
        <Box display="flex">
          <Box mr={1}>
            <HistoryEduIcon />
          </Box>
          <Typography>Create Moment</Typography>
        </Box>
      </Link>
    </>
  );
}

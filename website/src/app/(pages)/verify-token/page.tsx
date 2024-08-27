import { Box, Button } from "@mui/material";
import { cookies } from "next/headers";

export default function VerifyToken() {
  async function action() {
    "use server";
    console.log("cookie session id ", cookies().get("loginSessionID"));
  }
  return (
    <Box component="form" action={action}>
      <Button type="submit">Submit</Button>
    </Box>
  );
}

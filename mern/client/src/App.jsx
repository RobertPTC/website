import { Box, Button } from "@mui/material";
import { useRef } from "react";
export default function App() {
  const formRef = useRef(null);
  async function onSubmit(e) {
    e.preventDefault();
    console.log("submit");
    if (formRef.current) {
      const body = new FormData(formRef.current);
      const req = await fetch("http://localhost:5050/payments/upload-file", {
        method: "POST",
        body,
      });
      const json = await req.json()
      console.log('req.json ', json)
    }
  }
  /**
   * @param {Event} e
   */
  function onFileChange(e) {
    console.log('e ', e.target.files)
  }
  return (
    <>
      <Box component="form" onSubmit={onSubmit} ref={formRef}>
        <Box component="input" type="file" name="paymentFile" accept=".xml" onChange={onFileChange}/>
        <Box
          component="input"
          type="hidden"
          name="companyID"
          value="dunkinDonuts"
        />
        <Button type="submit">Upload</Button>
      </Box>
    </>
  );
}

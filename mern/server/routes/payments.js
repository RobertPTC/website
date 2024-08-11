import express from "express"
import fileUpload from "express-fileupload";

const router = express.Router()

router.use(fileUpload())

router.post("/upload-file", async (req, res) => {
    console.log('req.file ', req.files)
    res.status(200).send('ok')
});

export default router;
const express = require("express");
const router = express.Router();
const {cloudinaryUploader, nidUploader} = require("../controllers/uploader.controller");

router.post("/upload-photos", cloudinaryUploader);
router.post("/upload-nid", nidUploader);

module.exports = router;

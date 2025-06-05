const cloudinary = require("../configs/cloudinary.config");
const fs = require("fs");
const path = require("path");

const getString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return "ghs---" + randomNumber.toString();
};

const NIDUploader = async (imgPath, id) => {
    try {
        const results = cloudinary.uploader.upload(imgPath, {
            folder: "test_img",
            public_id: id,
            transformation: [
                {
                    width: 640,
                    height: 480,
                    color: "black",
                    effect: "grayscale"
                }
            ]
        });
        return results;
    } catch (error) {
        console.log("Error in Uploader - ", error);
        return error;
    }
};

const Uploader = async (imgPath, size, id) => {
    try {
        const results = await cloudinary.uploader.upload(imgPath, {
            folder: "test_img",
            public_id: id,
            transformation: [
                { effect: "enhance" },
                { effect: "background_removal" },
                { effect: "improve" },
                { background: "#00339f" },
                {
                    aspect_ratio: "5:6",
                    gravity: "face",
                    height: size,
                    width: size,
                    format: "png",
                    zoom: "0.75",
                    crop: "thumb"
                }
            ]
        });
        return results;
    } catch (error) {
        console.log("Error in Uploader - ", error);
        return error;
    }
};

const cloudinaryUploader = async (req, res) => {
    const { photo_copy, size } = req.body;
    const photos = req.body.photos;
    try {
        var results = [];
        if (!photos || photos?.length === 0) throw new Error("No Images Found");
        const promiseResults = photos.map(async (photo, index) => {
            const result = await Uploader(photo, size, getString());
            results.push(result);
        });
        await Promise.all(promiseResults);
        return res.status(200).json({
            success: true,
            message: "Photo Created Successfully",
            copy_size: photo_copy,
            results
        });
    } catch (error) {
        await fs.writeFileSync("error-logs.txt", error.message);
        console.log("ERROR In cloudinaryUploader Controller - ", error.message);
        return res.status(403).json({
            success: false,
            message: error.message || "ERROR : Photo Created Failed - 403"
        });
    }
};
const nidUploader = async (req, res) => {
    const { copy_size, nid_front, nid_back } = req.body;
    try {
        var results = [];
        if (!nid_front && !nid_back) throw new Error("No Images Found");
        const [nidFrontResult, nidBackResult] = await Promise.all([
            NIDUploader(nid_front, getString()),
            NIDUploader(nid_back, getString())
        ]);
        results.push(nidFrontResult, nidBackResult);

        return res.status(200).json({
            success: true,
            message: "Photostat Created Successfully",
            copy_size,
            results
        });
    } catch (error) {
        await fs.writeFileSync("error-logs.txt", error.message);
        console.log("ERROR In nidUploader Controller - ", error.message);
        return res.status(403).json({
            success: false,
            message: error.message || "ERROR : Photo Created Failed - 403"
        });
    }
};

module.exports = { Uploader, cloudinaryUploader, nidUploader, NIDUploader };

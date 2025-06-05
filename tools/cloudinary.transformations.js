require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const cloudinaryUploader = async (imgPath, id) => {
    try {
        const results = await cloudinary.uploader.upload(imgPath,   {
        folder: "test_img",
        public_id: id, //"passport-1",
        transformation: [
            { effect: "enhance" },
            { effect: "background_removal" },
            { effect: "improve" },
            {
                effect: "gen_background_replace:prompt_a hot blue fill background"
            },
            {
                aspect_ratio: "5:6",
                gravity: "face",
                height: 600,
                width: 600,
                zoom: "0.75",
                crop: "thumb"
            }
        ]
    });
        return results;
    } catch (error) {
        return error;
    }
};

const editImage = async (img_url, option) => {
    try {
        const results = await cloudinary.url(img_url, option);
        return results;
    } catch (error) {
        return error;
    }
};

const getImageData = async img_url => {
    try {
        const results = await cloudinary.api.resource(img_url);
        return results;
    } catch (error) {
        return error;
    }
};


/*
cloudinary.image("docs/textured_handbag.jpg", {overlay: "lut:iwltbap_aspen.3dl"})

cloudinary.image("hallway.jpg", {effect: "improve"})

cloudinary.image("docs/escalator-200.jpg", {effect: "upscale"})

cloudinary.image("docs/denim.jpg", {transformation: [
  {width: 300, crop: "scale"},
  {effect: "gen_restore"}
  ]})
  
  cloudinary.image("docs/under-exposed.jpg", {effect: "enhance"})
  
  // Remove Background and cropping 
  
  cloudinary.image("docs/rmv_bgd/dog_couch_orig", {effect: "background_removal"})
  
  cloudinary.image("docs/rmv_bgd/dog_couch_orig", {transformation: [
  {effect: "background_removal"},
  {effect: "grayscale"}
  ]})
  cloudinary.image("docs/camera.jpg", {background: "auto", gravity: "auto", height: 400, width: 80, crop: "fill_pad"})
  
  cloudinary.image("docs/camera.jpg", {aspect_ratio: "5:6", gravity: "face", height: 150, zoom: "0.75", crop: "thumb"})
  
  cloudinary.image("docs/camera.jpg", {gravity: "auto", height: 350, width: 300, crop: "auto"})
  
  // Replace Background 
  cloudinary.image("docs/motorbike.png", {effect: "gen_background_replace:prompt_a deserted street"})
  
*/




module.exports = { cloudinaryUploader, editImage, getImageData };

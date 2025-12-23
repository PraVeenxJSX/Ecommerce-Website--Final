const cloudinary = require("../config/cloudinary");
const path = require("path");

const uploadImageToCloudinary = async (localPath, folder) => {
  const result = await cloudinary.uploader.upload(localPath, {
    folder,
  });

  return result.secure_url;
};

module.exports = uploadImageToCloudinary;

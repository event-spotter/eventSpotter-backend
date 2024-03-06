const axios = require("axios");

async function uploadImageToCloudinary(file) {
  try {
    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/upload`;

    const dataToUpload = new FormData();
    dataToUpload.append("file", file);
    dataToUpload.append("upload_preset", process.env.UNSIGNED_UPLOAD_PRESET);

    const response = await axios.post(url, dataToUpload);

    if (response.data && response.data.secure_url) {
      return response.data.secure_url;
    } else {
      throw new Error("Failed to upload image to Cloudinary.");
    }
  } catch (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }
}

module.exports = { uploadImageToCloudinary };
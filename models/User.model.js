const { Schema, model } = require("mongoose");
const axios = require("axios")

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    image: {
      type: String
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

userSchema.methods.uploadImageToCloudinary = async function (file) {
  const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/upload`;

  const dataToUpload = new FormData();
  dataToUpload.append("file", file);
  dataToUpload.append("upload_preset", process.env.UNSIGNED_UPLOAD_PRESET);

  try {
    const response = await axios.post(url, dataToUpload);
    this.image = response.data.secure_url;
    return this.image;
  } catch (error) {
    console.error("Error uploading the file:", error);
    throw new Error("Error uploading the file");
  }
};

const User = model("User", userSchema);

module.exports = User;

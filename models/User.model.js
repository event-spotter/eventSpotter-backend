const { Schema, model } = require("mongoose");
const {uploadImageToCloudinary} = require("../cloudinary/cloudinary")

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    username: {
      type: String,
      required: true,
      unique: true
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

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("image")) {
      const imageUrl = await uploadImageToCloudinary(this.image);
      this.image = imageUrl;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = model("User", userSchema);

module.exports = User;

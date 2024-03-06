const { Schema, model } = require("mongoose");

const artistSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      unique: true
    },
    genre: {
        type: String
      },
    description: {
      type: String
    },
    image: {
        type: String,
        default: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Artist = model("Artist", artistSchema);

module.exports = Artist;

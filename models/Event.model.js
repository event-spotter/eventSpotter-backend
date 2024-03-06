const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Name is required."],
    },
    artist: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
    description: {
      type: String
    },
    category: {
        type: String,
        enum: ["Concerts, Theatre, Comedy, Dance, Museum"]
      },
    image: {
        type: String,
        default: 
      },
   

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;

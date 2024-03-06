const { Schema, model } = require("mongoose");

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
        default: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date, 
        default: Date.now
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;

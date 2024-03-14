const router = require("express").Router();
const mongoose = require("mongoose");
const Event = require("../models/Event.model");
const User = require("../models/User.model");

const {
  isAuthenticated,
  isEventOwner,
} = require("../middleware/jwt.middleware");

// POST /events
router.post("/events", isAuthenticated, (req, res, next) => {
  const { title, artist, description, category, image, location, date } =
    req.body;

  // Validate the date format before parsing
  if (!Date.parse(date)) {
    return res.status(400).json({
      message: "Invalid date format. Date must be in YYYY-MM-DD format.",
    });
  }

  // Convert date string to Date object
  const formattedDate = new Date(date);

  let owner = req.payload._id;
  Event.create({
    title,
    artist,
    description,
    category,
    image,
    location,
    date: formattedDate,
    owner,
  })
    .then((createdEvent) => {
      return Event.populate(createdEvent, { path: "artist" });
    })
    .then((populatedEvent) => {
      res.status(201).json(populatedEvent);
    })
    .catch((e) => {
      console.log("Error creating a new event");
      console.log(e);
      res.status(500).json({ message: "Error creating a new event" });
    });
});

// GET /events
router.get("/events", (req, res) => {
  Event.find()
    .populate("artist")
    .then((eventsFromDB) => {
      res.json(eventsFromDB);
    })
    .catch((e) => {
      console.log("Error getting list of events");
      console.log(e);
      res.status(500).json({ message: "Error getting list of events" });
    });
});


router.get("/events/favorites", isAuthenticated, (req, res) => {

    let userId = req.payload._id;
    console.log(userId);

    User.findOne({ _id: userId })
    .then((userDetails) => {
       
        Event.find({
            '_id': { $in: userDetails.favoriteEvents}})
        .then((eventsFromDB) => {
          res.json(eventsFromDB);
        })
        .catch((e) => {
          console.log("Error getting list of events");
          console.log(e);
          res.status(500).json({ message: "Error getting list of events" });
        }); 

    })
    .catch((e) => {
      console.log("Error getting user details");
      console.log(e);
      res.status(500).json({ message: "Error getting user details" });
    });
    
  });

router.get("/events/user/:userId", isAuthenticated, (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  // validate eventId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Event.find({ owner: userId })
    .populate("artist")
    .then((eventList) => {
      console.log(eventList);
      res.json(eventList);
    })
    .catch((e) => {
      console.log("Error getting event details");
      console.log(e);
      res.status(500).json({ message: "Error getting event details" });
    });
});

// GET /events/:eventId
router.get("/events/:eventId", (req, res) => {
  const { eventId } = req.params;
   // validate eventId
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Event.findById(eventId)
    .populate("artist")
    .then((eventDetails) => {
      res.json(eventDetails);
    })
    .catch((e) => {
      console.log("Error getting event details");
      console.log(e);
      res.status(500).json({ message: "Error getting event details" });
    });
});

// PUT /events/:eventId
router.put(
  "/events/:eventId",
  isAuthenticated,
  isEventOwner,
  (req, res, next) => {
    const { eventId } = req.params;
    const { title, artist, description, category, image, location, date } =
      req.body;

    // validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Event.findByIdAndUpdate(
      eventId,
      { title, description, artist, category, image, location, date },
      { new: true }
    )
      .populate("artist")
      .then((updatedEvent) => {
        res.json(updatedEvent);
      })
      .catch((e) => {
        console.log("Error updating event");
        console.log(e);
        res.status(500).json({ message: "Error updating event" });
      });
  }
);

// DELETE /events/:eventId
router.delete(
  "/events/:eventId",
  isAuthenticated,
  (req, res, next) => {
    const { eventId } = req.params;
    const ownerId = req.payload._id;

    // validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Specified id is not valid" });
    }

    Event.findById(eventId)
    .then((event) => {
      if (!event) {
        return res.status(404).json({ message: `Event with id ${eventId} not found` });
      } 

      // Check if the authenticated user is the owner of the event
      if (event.owner.toString() !== ownerId) {
        return res.status(401).json({ message: "You are not the owner and are not allowed to delete this event." });
      }

      // If the user is the owner, proceed with deleting the event
      return Event.findByIdAndDelete(eventId);
    })
    .then((deletedEvent) => {
      if (!deletedEvent) {
        return res.status(404).json({ message: `Event with id ${eventId} not found` });
      }
      res.json({ message: `Event with id ${eventId} is removed successfully.` });
    })
    .catch((error) => {
      console.log("Error deleting event", error);
      res.status(500).json({ message: "Error deleting event" });
    });
}
);


module.exports = router;

const router = require("express").Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

// GET /users/:userId
router.get("/users/:userId", isAuthenticated, (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  // validate eventId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findOne({ _id: userId }, { password: 0, createdAt: 0, updatedAt: 0 })
    .then((userDetails) => {
      res.json(userDetails);
    })
    .catch((e) => {
      console.log("Error getting user details");
      console.log(e);
      res.status(500).json({ message: "Error getting user details" });
    });
});

// PUT /users/:userId
router.put("/users/:userId", isAuthenticated, (req, res, next) => {
  const { userId } = req.params;
  const { image } = req.body;

  // validate eventId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findByIdAndUpdate(userId, { image }, { new: true })
    .select({ password: 0, createdAt: 0, updatedAt: 0 })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((e) => {
      console.log("Error updating user");
      console.log(e);
      res.status(500).json({ message: "Error updating user" });
    });
});

//add event to user favorites
router.get("/users/favorites/:eventId", isAuthenticated, (req, res, next) => {
  const { eventId } = req.params;
  let userId = req.payload._id;

  // validate eventId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.updateOne(
    { _id: userId },
    { $addToSet: { favoriteEvents: eventId } },
    { new: true, upsert: true }
  )
    .select({ password: 0, createdAt: 0, updatedAt: 0 })
    .then((updatedUser) => {
      res.status(200).json({ message: "Added to Favorites" });
    })
    .catch((e) => {
      console.log("Error adding to Favorites ");
      console.log(e);
      res.status(500).json({ message: "Error updating favorites" });
    });
});




//delete event from user favorites
router.delete(
  "/users/favorites/:eventId",
  isAuthenticated,
  (req, res, next) => {
     
    const { eventId } = req.params;
    let userId = req.payload._id;

    // validate eventId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    User.updateOne(
      { _id: userId },
      {
        $pullAll: {
          favoriteEvents: [eventId],
        }
      }
    )
      .select({ password: 0, createdAt: 0, updatedAt: 0 })
      .then((updatedUser) => {
        res.status(200).json({ message: "Deleted from Favorites" });
      })
      .catch((e) => {
        console.log("Error removing from Favorites ");
        console.log(e);
        res.status(500).json({ message: "Error removing favorites" });
      });
  }
);

module.exports = router;

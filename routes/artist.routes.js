const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const FormData = require("form-data");
const User = require("../models/User.model");

const Artist = require("../models/Artist.model");
const { isAuthenticated, isArtistOwner, } = require("../middleware/jwt.middleware");

// Create a new Artist
router.post("/artists", isAuthenticated, (req, res, next) => {

      const { name, genre, description, image } = req.body;
    
      Artist.create({
        name,
        genre,
        description,
        image
      })
      .then ((response) => res.json(response))
     .catch( (e) => {
         console.log("Error creating a new artist");
         console.log(e)
         res.status(500).json({message: "Error creating a new artist"})
     });
});

// Retrieve list of Artists
router.get("/artists", (req, res, next) => {
    Artist.find()
      .then((listOfArtists) => {
        res.status(200).json(listOfArtists);
      })
      .catch((err) => {
        next(err);
      });
  });

// Get Artist by ID
router.get("/artists/:artistId", (req, res, next) => {
    Artist.findById(req.params.artistId)
      .then((artistById) => {
        res.status(200).json(artistById);
      })
      .catch((err) => {
        next(err);
      });
  });

// Update an Artist
router.put("/artists/:artistId", isAuthenticated, (req, res, next) => {
    Artist.findByIdAndUpdate(req.params.artistId, req.body, { new: true })
      .then((updateArtist) => {
        res.status(200).json(updateArtist);
      })
      .catch((err) => {
        next(err);
      });
  });

// Delete an Artist
router.delete("/artists/:artistId", isAuthenticated, isArtistOwner, (req, res, next) => {
  
  const {artistId} = req.params;

  if (!mongoose.Types.ObjectId.isValid(artistId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

    Artist.findByIdAndDelete(artistId)
      .then(() => {
        res.json({ message: `Artist with ${artistId} is removed successfully.` });
      })
      .catch((err) => {
        console.log("Error deleting artist");
        console.log(e);
        res.status(500).json({ message: "Error deleting artist" });
      });
  });

module.exports = router;

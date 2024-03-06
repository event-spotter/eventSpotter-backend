const express = require("express");
const router = express.Router();
const FormData = require("form-data");

const Artist = require("../models/Artist.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Create a new Artist
router.post("/artists", isAuthenticated, async (req, res, next) => {
    try {
      const { name, genre, description, image } = req.body;
      if (!name) {
        res.status(400).json({ message: "Name is required." });
        return;
      }

      let imageUrl = ""; 
      if (image) {
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "artists", 
        });
        imageUrl = cloudinaryResponse.secure_url;
      }
  
      const createdArtist = await Artist.create({
        name,
        genre,
        description,
        image: imageUrl,
      });
  
      res.status(201).json(createdArtist);
    } catch (err) {
      next(err);
    }
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
router.delete("/artists/:artistId", isAuthenticated, (req, res, next) => {
    Artist.findByIdAndDelete(req.params.artistId)
      .then(() => {
        res.status(204).json();
      })
      .catch((err) => {
        next(err);
      });
  });

module.exports = router;
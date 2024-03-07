const router = require('express').Router();
const mongoose = require('mongoose');
const Event = require("../models/Event.model");

const {isAuthenticated} = require("../middleware/jwt.middleware");


// POST /events
router.post("/events", isAuthenticated, (req, res, next) => {

    const {title, description,location} = req.body;

    Event.create({title, description,location})
        .then( (createdEvent) => {
            res.status(201).json(createdEvent)
        })
        .catch( (e) => {
            console.log("Error creating a new event");
            console.log(e)
            res.status(500).json({message: "Error creating a new event"})
        });
});


// GET /events
router.get("/events", (req, res) => {
    Event.find()
        .populate("artist")
        .then( (eventsFromDB) => {
            res.json(eventsFromDB);
        })
        .catch( (e) => {
            console.log("Error getting list of events");
            console.log(e)
            res.status(500).json({message: "Error getting list of events"})
        });
});

// GET /events/:eventId 
router.get("/events/:eventId", (req, res) => {
    
    const {eventId} = req.params;
    console.log(eventId);
    // validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Event.findById(eventId)
        .populate("artist")
        .then( (eventDetails) => {
            res.json(eventDetails);
        })
        .catch( (e) => {
            console.log("Error getting event details");
            console.log(e)
            res.status(500).json({message: "Error getting event details"})
        });
});


// PUT /events/:eventId 
router.put("/events/:eventId", isAuthenticated, (req, res, next) => {

    const {eventId} = req.params;
    const {title, description} = req.body;

    // validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Event.findByIdAndUpdate(eventId, {title, description}, { new: true })
        .then( (updatedEvent) => {
            res.json(updatedEvent);
        })
        .catch( (e) => {
            console.log("Error updating event");
            console.log(e)
            res.status(500).json({message: "Error updating event"})
        });

});



// DELETE /events/:eventId
router.delete("/events/:eventId", isAuthenticated, (req, res, next) => {

    const {eventId} = req.params;

    // validate projectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Event.findByIdAndDelete(eventId)
        .then( () => {
            res.json({ message: `Project with ${eventId} is removed successfully.` })
        })
        .catch( (e) => {
            console.log("Error deleting event");
            console.log(e)
            res.status(500).json({message: "Error deleting event"})
        });
});


module.exports = router;
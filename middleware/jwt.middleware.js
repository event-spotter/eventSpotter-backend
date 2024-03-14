const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");
const Event = require("../models/Event.model");

// Instantiate the JWT token validation middleware
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1]; // get the token from headers "Bearer 123XYZ..."

  if(!token){
    return res.status(401).json({ error: "Token not provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET) // the verify method decodes/validates the token and returns the payload
  
    req.payload = payload // this is to pass the decoded payload to the next route as req.payload
    next()

  } catch (error) {
    // the middleware will catch any error in the try and send 401 if:
    // 1. There is no token
    // 2. Token is invalid
    // 3. There is no headers or authorization in req (no token)
    res.status(401).json({error: "Token not valid"})
  }
}


const isEventOwner = (req, res, next) => {
 
console.log("checking ownerId");
  try {
     
    const ownerId = req.payload._id;
    const {eventId} = req.params;

    Event.findOne({_id: eventId, owner: ownerId })
    .then((event) => {
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      next();
    })
    .catch((error) => {
      console.log("Error checking event ownership:", error);
      res.status(500).json({ message: "Error checking event ownership" });
    });
} catch (error) {
  res.status(401).json({ error: "Token not valid" });
}
};

   

// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
  isEventOwner
}
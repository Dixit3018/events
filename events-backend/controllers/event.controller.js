const fs = require("fs");

const Event = require("../models/event");
const User = require("../models/user");

const { getUserIdFromToken, imagePathToBase64 } = require("../utils/utils");

// get all generated events by organizer on his app
const getEvents = async (req, res) => {
  try {
    const organizer_id = getUserIdFromToken(req);

    const events = await Event.find({ organizer_id: organizer_id });

    if (events.length === 0) {
      return res.status(200).json({ msg: "No events are there!" });
    }

    const modifiedRes = await Promise.all(
      events.map(async (event) => {
        const image = await imagePathToBase64(event.cover_img);
        return {
          ...event._doc,
          cover_img: image,
        };
      })
    );

    return res.status(200).json({ events: modifiedRes });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

//update event cover image
const updateEventImage = async (req, res) => {
  try {
    const { eventId } = req.body;
    const newImage = req.file.path;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const oldImage = event.cover_img;
    if (oldImage) {
      fs.unlink(oldImage, (err) => {
        if (err) {
          console.error("error deleting Event Image:" + err);
        }
      });
    }

    event.cover_img = newImage;

    const updatedEvent = await event.save();

    const imageData = await imagePathToBase64(event.cover_img);
    updatedEvent.cover_img = imageData;

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
      message: "success",
      event: updatedEvent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// update event data
const updateEventData = async (req, res) => {
  try {
    const { name, venue, description, city , state, eventId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    event.name = name;
    event.venue = venue;
    event.description = description;
    event.city = city;
    event.state = state;
    await event.save();

    return res.status(200).json({message: "success"})

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// get all events
const getAllEvents = async (req, res) => {
  const events = await Event.find();
  const modifiedRes = await Promise.all(
    events.map(async (event) => {
      const image = await imagePathToBase64(event.cover_img);
      return {
        ...event._doc,
        cover_img: image,
      };
    })
  );
  res.status(200).json({ events: modifiedRes });
};

// Create Event
const createEvent = async (req, res) => {
  try {
    const organizerId = getUserIdFromToken(req);

    const userExist = await User.findOne({
      _id: organizerId,
    });

    if (!userExist) {
      return res.status(404).json("User Not Found");
    }
    const event = req.body;

    const coverImg = req.file.path;

    const newEvent = new Event({
      organizer_id: organizerId,
      name: event.eventName,
      venue: event.eventVenue,
      description: event.eventDescription,
      volunteers: event.eventNeededVolunteers,
      pay_per_volunteer: event.eventPayPerDay,
      start_date: new Date(event.eventStartDate),
      end_date: new Date(event.eventEndDate),
      days: event.eventDays,
      city: event.eventCity,
      state: event.eventState,
      hired: 0,
      cover_img: coverImg,
    });

    const savedEv = await newEvent.save();

    return res.status(200).json({
      message: "Event Registered Successfully",
      event_details: savedEv,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

// Get single event
const getSingleEvent = async (req, res) => {
  const event_id = req.query.event_id;
  const event = await Event.findById(event_id);

  const organizer = await User.findById(event.organizer_id);

  if (event === null) {
    throw new Error("No event found");
  }
  const image = await imagePathToBase64(event.cover_img);

  const modifiedEvent = {
    ...event._doc,
    cover_img: image,
    organizer_name: organizer.firstname + " " + organizer.lastname,
  };

  if (event) {
    return res.status(200).json({ event: modifiedEvent });
  } else {
    return res.status(500).json({ err: "something went wrong" });
  }
};

module.exports = {
  getEvents,
  getAllEvents,
  createEvent,
  getSingleEvent,
  updateEventImage,
  updateEventData
};

const { getUserIdFromToken, imagePathToBase64 } = require("../utils/utils");

const Event = require("../models/event");
const User = require("../models/user");

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
    console.log(organizerId);
    const userExist = await User.findOne({
      _id: organizerId,
    });

    console.log(userExist);
    if (!userExist) {
      return res.status(404).json("User Not Found");
    }
    const event = req.body;

    const coverImg = req.file.path;
    console.log(req.body);
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
  const event_id = req.body.event_id;
  const event = await Event.findById(event_id);

  const organizer = await User.findById(event.organizer_id);

  if (event === null) {
    throw new Error("No event found");
  }
  const image = await imagePathToBase64(event.cover_img);

  const modifiedEvent = {
    ...event._doc,
    cover_img: image,
    organizer_name: organizer.firstname + " " + organizer.lastname ,
  };

  if (event) {
    return res.status(200).json({ event: modifiedEvent });
  } else {
    return res.status(500).json({ err: "something went wrong" });
  }
};

module.exports = { getEvents, getAllEvents, createEvent, getSingleEvent };

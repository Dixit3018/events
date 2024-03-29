const Event = require("../models/event");
const Feedback = require("../models/feedback");

const giveFeedbackToVolunteer = async (req, res) => {
  try {
    const { feedback } = req.body;
    let feedExists = false;
    let eventId;

    const feedbackPromises = feedback.map(async (feed) => {
      const checkFeedback = await Feedback.findOne({
        user_id: feed.userId,
        event_id: feed.eventId,
      });
      if (checkFeedback === null) {
        eventId = feed.eventId;
        feedExists = true;
        const newFeedback = await Feedback.create({
          user_id: feed.userId,
          event_id: feed.eventId,
          role: feed.role,
          review: feed.rate,
        });
        await newFeedback.save();
      }
    });

    await Promise.all(feedbackPromises);

    if (feedExists) {
      const event = await Event.findOne({ _id: eventId });
      event.feedbackStatus = true;
      await event.save();
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getEventFeedbacks = async (req, res) => {
  const { eventId } = req.query;

  const feedbacks = await Feedback.find({ event_id: eventId });

  if (!feedbacks) {
    return res.status(404).json({ error: "feedback not found" });
  }

  res.status(200).json({ feedbacks: feedbacks });
};

module.exports = { giveFeedbackToVolunteer, getEventFeedbacks };

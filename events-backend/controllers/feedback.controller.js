const Event = require("../models/event");
const Feedback = require("../models/feedback");
const Users = require("../models/user");

const { getUserIdFromToken } = require("../utils/utils");

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

        const user = await Users.findOne({ _id: feed.userId})
        averageRate = +user.rating != 0 ? (+feed.rate + +user.rating)/2 : +feed.rate;
        user.rating = averageRate.toString();
        await newFeedback.save();
        await user.save();
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

const getEventFeedback = async (req,res) => {
    const userId = getUserIdFromToken(req);
    const { eventId } = req.query;

    const feedback = await Feedback.findOne({ user_id: userId, event_id: eventId });
    if (!feedback) {
      return res.status(204).json({ message: "feedback not found", feedback:[] });
    }
    return res.status(200).json({ mesage: "success", feedback: feedback})
}
module.exports = { giveFeedbackToVolunteer, getEventFeedbacks, getEventFeedback };

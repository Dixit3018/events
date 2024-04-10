const Activity = require("../models/activity.model");
const { getUserIdFromToken } = require("../utils/utils");


const trackUserActivity = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
      const { timeSpent, date } = req.body;
  
      const exist = await Activity.findOne({ user_id: userId, date: date });
      if (exist) {
        exist.timeSpent += timeSpent;
        exist.save();
      } else {
        const activity = await Activity.create({
          user_id: userId,
          timeSpent: timeSpent,
          date: date,
        });
      }
  
      return res.status(200);
    } catch (error) {
      return res.status(500).json({ err: "Something went wrong" });
    }
  }

  const getActivity = async (req, res) => {
    try {
      const userId = getUserIdFromToken(req);
  
      const exist = await Activity.find({ user_id: userId });
      if (exist) {
        return res.status(200).json({ activity: exist });
      } else {
        return res.status(200).json({ activity: null });
      }
    } catch (error) {
      return res.status(500).json({ err: error });
    }
  }

  module.exports = { trackUserActivity, getActivity }
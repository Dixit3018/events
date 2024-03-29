const fs = require("fs");
const User = require("../models/user");
const Event = require("../models/event");

const {
  imagePathToBase64,
  getUserIdFromToken,
  filterSensitiveData,
} = require("../utils/utils");
const Application = require("../models/application");
const Feedback = require("../models/feedback");

//--------------------- Common

// update userProfile
const updateUser = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const userData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.firstname = userData.firstname;
    user.lastname = userData.lastname;
    user.username = userData.username;
    user.age = userData.age;
    user.email = userData.email;
    user.address = userData.address;
    user.state = userData.state;
    user.city = userData.city;

    const updatedUser = await user.save();
    updatedUser.profilePicture = await imagePathToBase64(
      updatedUser.profilePicture
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: filterSensitiveData(updatedUser._doc),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update profile image
const updateProfileImage = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const newProfilePicture = req.file.path;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const oldProfilePicture = user.profilePicture;

    if (oldProfilePicture) {
      fs.unlink(oldProfilePicture, (err) => {
        if (err) {
          console.error("error deleting profile picture:" + err);
        }
      });
    }

    user.profilePicture = newProfilePicture;

    const updatedUser = await user.save();
    const imageData = await imagePathToBase64(user.profilePicture);
    const userData = updatedUser;
    userData.profilePicture = imageData;

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: filterSensitiveData(userData._doc),
      profileImg: imageData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//------------------------ User volunteer-------------------------

const getOrganizerData = async (req, res) => {
  try {
    const { organizer_id } = req.body;
    const organizer = await User.findOne({ _id: organizer_id });
    organizer.profilePicture = await imagePathToBase64(
      organizer.profilePicture
    );
    res.status(200).json({ organizer: organizer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//apply on event
const applyOnEvent = async (req, res) => {
  try {
    volunteer_id = getUserIdFromToken(req);
    const { event_id, organizer_id } = req.body;

    const checkAlreadyApplied = await Application.find({
      event_id: event_id,
      organizer_id: organizer_id,
      volunteer_id: volunteer_id,
    });

    if (checkAlreadyApplied.length > 0) {
      return res.status(202).json({ message: "Already applied" });
    }

    const application = new Application({
      event_id: event_id,
      organizer_id: organizer_id,
      volunteer_id: volunteer_id,
    });

    const apply = await application.save();
    return res.status(200).json({ message: "success", application: apply });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "fail", error: error.message });
  }
};

// get applied events
const getAppliedEvents = async (req, res) => {
  try {
    const id = getUserIdFromToken(req);

    const application = await Application.find({ volunteer_id: id });

    if (application.length === 0) {
      return res.status(202).json({ message: "No applications" });
    }
    return res.status(200).json({ application: application });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

const getCompletedEvents = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const completedEvents = await Event.find({
      hired_volunteers: { $in: [userId] },
      end_date: { $lt: new Date() },
    });
    if (completedEvents.length === 0) {
      return res.status(202).json({ message: "No completed events" });
    }

    const promises = completedEvents.map(async (event) => {
      event.cover_img = await imagePathToBase64(event.cover_img);
    });
    await Promise.all(promises);
    return res.status(200).json({ completedEvents: completedEvents });
  } catch (error) {
    console.log(error);
  }
};

//------------------------ User organizer-------------------------

const getVolunteers = async (req, res) => {
  const userId = getUserIdFromToken(req);

  let volunteers = await User.find({ role: "volunteer" });

  for (const user of volunteers) {
    user.profilePicture = await imagePathToBase64(user.profilePicture);
  }
  volunteers = volunteers.map((user) => ({ ...user.toObject() }));

  if (volunteers) {
    return res.status(200).json({ volunteers: volunteers });
  } else {
    return res.status(500).json({ err: "something went wrong" });
  }
};

const getVolunteerDetails = async (req, res) => {
  try {
    const id = req.query.userId;

    const volunteer = await User.findOne({ _id: id, role: "volunteer" });

    if (volunteer) {
      volunteer.profilePicture = await imagePathToBase64(
        volunteer.profilePicture
      );
    }
    res.status(200).json({ volunteer: filterSensitiveData(volunteer)._doc });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

//get applications
const getApplications = async (req, res) => {
  try {
    const id = getUserIdFromToken(req);
    let applicantDetails = [];
    const applications = await Application.find({ organizer_id: id });

    if (applications.length === 0) {
      return res.status(202).json({ message: "No applications" });
    }

    const getApplicantDetails = applications.map(async (app) => {
      const applicant = await User.findById(app.volunteer_id).select({
        email: 1,
        username: 1,
        firstname: 1,
        lastname: 1,
        age: 1,
        address: 1,
        city: 1,
        state: 1,
        rating: 1,
        profilePicture: 1,
      });

      const eventDetails = await Event.findById(app.event_id).select({
        name: 1,
        volunteers: 1,
        hired: 1,
        start_date: 1,
        end_date: 1,
      });

      applicant.profilePicture = await imagePathToBase64(
        applicant.profilePicture
      );

      return {
        application_id: app._id,
        ...app.toObject(),
        ...applicant.toObject(),
        eventDetails,
      };
    });

    applicantDetails = await Promise.all(getApplicantDetails);

    res.status(200).json({ message: "success", data: applicantDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// update (response) to application
const responseToApplication = async (req, res) => {
  try {
    const { application_id, status, volunteer_id } = req.body;

    const application = await Application.findById(application_id);
    const event = await Event.findById(application.event_id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    application.status = status;

    if (status === "accepted") {
      if (volunteer_id === null) {
        return res.status(404).json({ error: "Volunteer not found" });
      }

      event.hired = +event.hired + 1;
      event.hired_volunteers.push(volunteer_id);
    }

    const updatedApplication = await application.save();
    const updatedEvent = await event.save();

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res
      .status(200)
      .json({ message: "Application updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

//----------------------------- Dashboard Data ---------------------------

const getDashboardData = async (req, res) => {
  user_id = getUserIdFromToken(req);

  isUserOrganizer = await User.findOne({ _id: user_id, role: "organizer" });
  isUserVolunteer = await User.findOne({ _id: user_id, role: "volunteer" });

  if (isUserOrganizer) {
    //organizer dashboard code
    res
      .status(200)
      .json({ status: "success", message: "success to find the organizer" });
  } else if (isUserVolunteer) {
    //volunteer dashboard code
    res
      .status(200)
      .json({ status: "success", message: "success to find the volunteer" });
  } else {
    //no user found
    res.status(404).json({ status: "fail", message: "fail to find the user" });
  }
};

module.exports = {
  updateUser,
  getVolunteers,
  getVolunteerDetails,
  updateProfileImage,
  getOrganizerData,
  applyOnEvent,
  getAppliedEvents,
  getApplications,
  responseToApplication,
  getDashboardData,
  getCompletedEvents
};

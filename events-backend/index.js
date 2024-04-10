const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const path = require("path");

// Middlewares
const { authenticateJWT } = require("./middlewares/authenticateJWT.middleware");

//Routes
const activityRoutes = require("./routes/activity.routes");
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const eventRoutes = require("./routes/event.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const homeRoutes = require("./routes/home.routes");
const paymentRoutes = require("./routes/payment.routes");
const seederRoutes = require("./routes/seeder.routes");
const taskRoutes = require("./routes/task.routes");
const userRoutes = require("./routes/user.routes");

const socketManager = require("./socket/socketManager");

const app = express();
const server = http.createServer(app);

const PORT = 4000;

app.use(cors());
mongoose.connect(`mongodb://localhost:27017/events`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));



const openApis = [
  "/api/contact-form",
  "/api/cities",
  "/api/login",
  "/api/register",
  "/api/forgot-password",
  "/api/reset-password",
  "/api/verify-token",
  "/api/homepage-details",
];

app.use((req, res, next) => {
  if (openApis.some((path) => req.path.startsWith(path))) {
    next();
  } else {
    authenticateJWT(req, res, next);
  }
});

app.use(
  "/api",
  activityRoutes,
  eventRoutes,
  authRoutes,
  feedbackRoutes,
  chatRoutes,
  homeRoutes,
  paymentRoutes,
  seederRoutes,
  taskRoutes,
  userRoutes
);


socketManager(server);



// Start the server
server.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});

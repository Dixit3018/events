const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
const routes = require("./routes/routes");
const cors = require("cors");
const path = require("path");

// Middlewares
const { authenticateJWT } = require("./middlewares/authenticateJWT.middleware");

const socketManager = require("./socketManager");


const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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
  "/api/reset-password/:id/:token",
  "/api/verify-token",
];

app.use((req, res, next) => {

  if (openApis.some((path) => req.path.startsWith(path))) {
    console.log("login");
    next();
  } else {
    authenticateJWT(req,res,next);
  }
});

app.use("/api", routes);

socketManager(server);


// Start the server
server.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});

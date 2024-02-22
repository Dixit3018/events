const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const cors = require('cors')
const path = require("path")

const app = express();
const PORT = 4000;
app.use(cors())

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
app.use("/api", routes);



app.listen(PORT, () => {
  console.log(`App Listening on ${PORT}`);
});
/*

*/
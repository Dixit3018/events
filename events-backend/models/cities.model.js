const mongoose = require("mongoose");

const citiesSchema = new mongoose.Schema({
  city: { type: String },
  lat: { type: String },
  lng: { type: String },
  country: { type: String },
  iso2: { type: String },
  admin_name: { type: String },
  capital: { type: String },
  population: { type: String },
  population_proper: { type: String },
});

const Cities = mongoose.model("Cities", citiesSchema);

module.exports = Cities;

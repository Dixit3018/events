const Cities = require("../models/cities");

const getCities = async (req, res) => {
    const data = await Cities.find().select("city admin_name").sort({ city: 1 });
  
    const list = data.map((val) => [val.city, val.admin_name]);
  
    return res.send({ data: list });
  }

  module.exports = {getCities};
const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  scans: { type: Number, default: 0 },
  created: { type: Number, default: 0 },
});

module.exports = mongoose.model("Stats", statsSchema);

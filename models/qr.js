const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
  qr: { type: String, require: true },
  url: { type: String, require: true },
  count: Number,
  code: String,
  protected: Boolean,
});

module.exports = mongoose.model("QR", qrSchema);

// backend/models/Report.js
const mongoose = require("mongoose");

const EvidenceSchema = new mongoose.Schema({
  type: String,
  path: String,
  filename: String,
  uploadedAt: { type: Date, default: Date.now },
});

const ReportSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  incidentTime: Date,
  locationText: String,
  description: { type: String, required: true },
  evidence: { type: [EvidenceSchema], default: [] },
  metadataEncrypted: { type: String },        // encrypted metadata (ip, ua)
  moderationStatus: { type: String, default: "pending" },
  flags: { type: Number, default: 0 },
});

// Export Mongoose model named "Report"
module.exports = mongoose.model("Report", ReportSchema);


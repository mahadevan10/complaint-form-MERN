const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Report = require("../models/Report");
const { encrypt } = require("../utils/crypto");

const router = express.Router();

// Setup upload directory
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const pref = Date.now();
    cb(null, `${pref}_${file.originalname.replace(/\s+/g, "_")}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 30 * 1024 * 1024 } }); // 30MB max

// POST /api/complaints
router.post("/", upload.single("evidence"), async (req, res) => {
  try {
    const { description, location_text, incident_time } = req.body;
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ error: "Provide a longer description (min 10 chars)." });
    }

    // Evidence
    const ev = [];
    if (req.file) {
      const mime = req.file.mimetype || "";
      const type = mime.startsWith("image") ? "image" : mime.startsWith("video") ? "video" : "file";
      ev.push({
        type,
        path: req.file.path,
        filename: req.file.filename,
      });
    }

    // Metadata (encrypt IP + user-agent)
    const metadata = {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      receivedAt: new Date().toISOString(),
    };
    const metaEnc = encrypt(metadata, process.env.ENCRYPTION_KEY);

    // Save report
    const report = new Report({
      incidentTime: incident_time ? new Date(incident_time) : null,
      locationText: location_text,
      description: description.trim(),
      evidence: ev,
      metadataEncrypted: metaEnc,
      moderationStatus: "pending",
    });

    await report.save();
    res.json({ status: "success", reportId: report._id });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

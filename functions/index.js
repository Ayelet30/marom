const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const {Storage} = require("@google-cloud/storage");
const fs = require("fs");
const sgMail = require("@sendgrid/mail");

// הגדרות כלליות
sgMail.setApiKey("YOUR_SENDGRID_API_KEY");

const app = express();
app.use(cors());
app.use(express.json()); // מאפשר קבלת JSON בבקשות POST

// ========== שליחת מייל ==========
app.post("/send", async (req, res) => {
  const {to, subject, text} = req.body;

  const msg = {
    to,
    from: "ayelethury@gmail.com",
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send("Email sent!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send email");
  }
});

// ========== העלאת קובץ ==========
const upload = multer({dest: "/tmp/"});
const storage = new Storage();
const bucketName = "marom-providers";
const bucket = storage.bucket(bucketName);

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const {path: filePath, originalname} = req.file;
    const destFileName = `uploads/${Date.now()}_${originalname}`;

    await bucket.upload(filePath, {
      destination: destFileName,
      metadata: {contentType: req.file.mimetype},
    });

    fs.unlinkSync(filePath);

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destFileName}`;
    res.json({url: publicUrl});
  } catch (error) {
    console.error("Error uploading:", error);
    res.status(500).send("Upload failed");
  }
});

// ========= ייצוא =========
exports.api = functions.https.onRequest(app);

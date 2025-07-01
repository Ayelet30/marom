import express from "express";
import cors from "cors";
//import multer from "multer";
//import { Storage } from "@google-cloud/storage";
//import fs from "fs";
import axios from "axios";
import { onRequest } from "firebase-functions/v2/https";
import sgMail from "@sendgrid/mail";

// ========== הגדרות ==========
sgMail.setApiKey("YOUR_SENDGRID_API_KEY");

const app = express();
app.use(cors());
app.use(express.json());

// ========== שליחת מייל ==========
app.post("/send", async (req, res) => {
  const { to, subject, text } = req.body;

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
// const upload = multer({ dest: "/tmp/" });
// const storage = new Storage();
// const bucketName = "marom-providers";
// const bucket = storage.bucket(bucketName);

// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const { path: filePath, originalname } = req.file;
//     const destFileName = `uploads/${Date.now()}_${originalname}`;

//     await bucket.upload(filePath, {
//       destination: destFileName,
//       metadata: { contentType: req.file.mimetype },
//     });

//     fs.unlinkSync(filePath);

//     const publicUrl = `https://storage.googleapis.com/${bucketName}/${destFileName}`;
//     res.json({ url: publicUrl });
//   } catch (error) {
//     console.error("Error uploading:", error);
//     res.status(500).send("Upload failed");
//   }
// });

// ========== ייצוא Express ==========
export const api = onRequest(app);

// ========== getCities ==========

export const getCities = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const response = await axios.get("https://data.gov.il/api/3/action/datastore_search", {
      params: {
        resource_id: "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba",
        limit: 10000,
      },
    });

    const cities = response.data.result.records
      .map((record) => record["שם_ישוב"])
      .filter(Boolean)
      .sort();

    res.status(200).json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).send("Failed to fetch cities");
  }
});

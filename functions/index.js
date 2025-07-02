import express from "express";
import multer from "multer";
import axios from "axios";
import { onRequest } from "firebase-functions/v2/https";
//import sgMail from "@sendgrid/mail";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";



// ========== הגדרות SendGrid ==========
// if (!process.env.SENDGRID_API_KEY) {
//   throw new Error("Missing SENDGRID_API_KEY environment variable");
// }
// sgMail.setApiKey(process.env.SENDGRID_API_KEY || functions.config().sendgrid.key);

// ===================== אפליקציית Express עיקרית =====================

const app = express();

// Middleware CORS כולל טיפול ב-OPTIONS
app.use(cors({ origin: "*" }));
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*"); // אפשר להגביל לפי domain פרודקשן
//   res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(204);
//   }
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======== API שליחת מייל ========
// app.post("/send", async (req, res) => {
//   const { to, subject, text } = req.body;

//   if (!to || !subject || !text) {
//     return res.status(400).send("Missing required fields (to, subject, text)");
//   }

//   const msg = {
//     to,
//     from: "ayelethury@gmail.com",
//     subject,
//     text,
//   };

//   try {
//     await sgMail.send(msg);
//     res.status(200).send("Email sent!");
//   } catch (error) {
//     console.error("SendGrid error:", error.response?.body || error.message || error);
//     res.status(500).send("Failed to send email");
//   }
// });

// =================== אפליקציית Express להעלאת קבצים ===================

if (!admin.apps.length) {
  admin.initializeApp();
}
const bucket = admin.storage().bucket("marom-9f242.appspot.com");

const uploadHandler = express();
uploadHandler.use(cors({ origin: "*" }));
uploadHandler.use(express.json());
uploadHandler.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

uploadHandler.post("/", upload.single("file"), async (req, res) => {
  console.log("📥 קיבלנו בקשה להעלאה");

  if (!req.file) {
    console.error("❌ לא נשלח קובץ");
    return res.status(400).json({ error: "לא נשלח קובץ או סוג הקובץ לא נתמך." });
  }

  try {
    const file = req.file;
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const uuid = uuidv4();

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
    });

    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;

    res.status(200).json({
      message: "הקובץ הועלה בהצלחה",
      url: downloadUrl,
      fileName,
      contentType: file.mimetype,
    });
  } catch (error) {
    console.error("🔥 שגיאה ב־upload:", error.message, error.stack);
    res.status(500).json({
      error: "שגיאה בהעלאה ל־Firebase",
      details: error.message,
    });
  }
});


// ========== Cache ל-getCities ==========
let cachedCities = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 דקות

export const getCities = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }
  
  if (cachedCities && Date.now() - cacheTimestamp < CACHE_TTL) {
    return res.status(200).json(cachedCities);
  }
  
  try {
    const response = await axios.get(
      "https://data.gov.il/api/3/action/datastore_search",
      {
        params: {
          resource_id: "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba",
          limit: 10000,
        },
      }
    );

    const cities = response.data.result.records
      .map((record) => record["שם_ישוב"])
      .filter(Boolean)
      .sort();

      cachedCities = cities;
      cacheTimestamp = Date.now();
      
      res.status(200).json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).send("Failed to fetch cities");
  }
});

// ========== ייצוא הפונקציות ל-Firebase ==========
export const api = onRequest(app);
export const uploadFile = onRequest(uploadHandler);



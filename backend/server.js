
// backend/server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Config
const PORT = process.env.PORT || 4000;
const COQUI_URL = process.env.COQUI_URL || "http://localhost:5002";

// ✅ TTS route
app.post("/api/tts", async (req, res) => {
  const { text, voice = "en", speed = 1 } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // Call Coqui TTS API
    const apiUrl = `${COQUI_URL}/api/tts?text=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Coqui API Error: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save audio file
    const filename = `voice_${Date.now()}.wav`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, buffer);

    // Send file URL
    res.json({ success: true, file: `/uploads/${filename}` });
  } catch (error) {
    console.error("❌ TTS Error:", error.message);
    res.status(500).json({
      success: false,
      error: "TTS generation failed",
      details: error.message,
    });
  }
});

// ✅ Serve audio files statically
app.use("/uploads", express.static(uploadsDir));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Backend is running...");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`🔗 Connected to Coqui server at ${COQUI_URL}`);
});

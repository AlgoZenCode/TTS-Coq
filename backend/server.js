// server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// --- Env & Config ---
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";
const COQUI_URL = process.env.COQUI_URL || "http://localhost:5002";
const RESPONSE_MODE = (process.env.RESPONSE_MODE || "stream").toLowerCase(); // "stream" | "link"
const CORS_ORIGINS = (process.env.CORS_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);

// --- App ---
const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// CORS: allow configured origins (fallback to wildcard only in dev)
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // mobile apps/curl
    if (CORS_ORIGINS.length === 0 && NODE_ENV !== "production") return cb(null, true);
    if (CORS_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: false
}));

// Basic rate limit (per IP)
app.use("/api/", rateLimit({
  windowMs: 60 * 1000,
  max: 30, // 30 requests/min/IP – tune as needed
  standardHeaders: true,
  legacyHeaders: false
}));

// Health
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    env: NODE_ENV,
    coqui: COQUI_URL,
    mode: RESPONSE_MODE
  });
});

// --- TTS (STREAM MODE default) ---
// Request: { text: string }
// Response (stream): audio/wav with attachment filename
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || !String(text).trim()) {
      return res.status(400).json({ success: false, error: "Text is required" });
    }

    // Call Coqui server
    const coquiEndpoint = `${COQUI_URL}/api/tts?text=${encodeURIComponent(text)}`;
    const coquiResp = await fetch(coquiEndpoint);

    if (!coquiResp.ok) {
      const body = await coquiResp.text().catch(() => "");
      return res.status(502).json({
        success: false,
        error: `Coqui error: ${coquiResp.status} ${coquiResp.statusText}`,
        details: body?.slice(0, 500)
      });
    }

    // If link mode requested and S3 configured, you could implement upload here.
    if (RESPONSE_MODE === "link") {
      // Minimal placeholder to keep fileless deploy simple:
      // recommend using Cloud/VPS with Nginx caching or add S3 upload here.
      return res.status(501).json({
        success: false,
        error: "RESPONSE_MODE=link not implemented in this build. Use stream mode or add S3 upload."
      });
    }

    // STREAM back to client (no disk writes)
    const filename = `voice_${Date.now()}.wav`;
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Pipe body to client
    coquiResp.body.pipe(res);
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ success: false, error: "TTS generation failed", details: err.message });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, error: "Server error" });
});

// Start
app.listen(PORT, () => {
  console.log(`✅ Backend up on :${PORT} [${NODE_ENV}]`);
  console.log(`🔗 COQUI_URL: ${COQUI_URL}`);
});

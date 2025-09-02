import React, { useState } from "react";

const BACKEND_URL = "https://your-backend.onrender.com"; // apna backend URL daalna

export default function TTSPlayer() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateTTS = async () => {
    if (!text) return alert("Please enter some text!");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob(); // audio/wav
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Optional: auto-download
      const a = document.createElement("a");
      a.href = url;
      a.download = `voice_${Date.now()}.wav`;
      a.click();

    } catch (err) {
      console.error(err);
      alert("Error generating voice!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>🗣️ Text-to-Speech Generator</h2>
      
      <textarea
        rows="4"
        style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={generateTTS}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "gray" : "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Voice"}
      </button>

      {audioUrl && (
        <div style={{ marginTop: "20px" }}>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}

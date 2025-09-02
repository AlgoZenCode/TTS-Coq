import React, { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function TTSForm() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <textarea
          className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
          rows="4"
          placeholder="Enter text to convert to speech..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white py-2 rounded-md hover:bg-secondary transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Convert to Speech"}
        </button>
      </form>

      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full" />
          <a
            href={audioUrl}
            download={`voice_${Date.now()}.wav`}
            className="text-sm text-primary underline mt-2 inline-block"
          >
            Download Audio
          </a>
        </div>
      )}
    </div>
  );
}

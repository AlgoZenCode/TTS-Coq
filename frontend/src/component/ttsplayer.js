const res = await fetch(`${BACKEND_URL}/api/tts`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text })
});
if (!res.ok) throw new Error("TTS failed");

const blob = await res.blob();            // audio/wav
const url = URL.createObjectURL(blob);    // e.g. blob:...
audio.src = url;                           // <audio controls src={url} />
// Optional: download
const a = document.createElement("a");
a.href = url;
a.download = `voice_${Date.now()}.wav`;
a.click();

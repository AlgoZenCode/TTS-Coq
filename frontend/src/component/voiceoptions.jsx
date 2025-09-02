export default function VoiceOptions({ voice, setVoice, speed, setSpeed }) {
  return (
    <div className="mt-4 flex gap-4">
      {/* Voice Selection */}
      <select
        className="p-2 rounded text-black"
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
      >
        <option value="en">English (Default)</option>
        <option value="hi">Hindi</option>
        <option value="fr">French</option>
      </select>

      {/* Speed Slider */}
      <div>
        <label className="mr-2">Speed:</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
        />
      </div>
    </div>
  );
}

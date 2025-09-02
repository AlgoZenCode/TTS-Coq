export default function AudioPlayer({ audio }) {
  return (
    <div className="mt-6">
      <audio controls src={audio}></audio>
      <a
        href={audio}
        download
        className="block mt-2 bg-green-600 px-4 py-2 rounded-lg"
      >
        Download Voice
      </a>
    </div>
  );
}

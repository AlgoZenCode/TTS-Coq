export default function GenerateButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
    >
      Generate Voice
    </button>
  );
}

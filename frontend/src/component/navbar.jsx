export default function Navbar() {
  return (
    <nav className="w-full p-4 bg-gray-800 flex justify-between text-white">
      <h1 className="font-bold text-xl">🎙️ TTS Generator</h1>
      <div className="space-x-6">
        <a href="#" className="hover:text-blue-400">Home</a>
        <a href="#" className="hover:text-blue-400">About</a>
        <a href="#" className="hover:text-blue-400">Login</a>
      </div>
    </nav>
  );
}

export default function TextInput({ text, setText }) {
  return (
    <textarea
      className="w-2/3 p-3 rounded-lg text-black"
      rows="5"
      placeholder="Type something to convert into voice..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

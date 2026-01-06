
const NotesSection = ({ notes, setNotes }) => {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Notes</h1>
      </div>

      {/* Notes Card */}
      <div className="bg-gray-100 rounded-xl p-5">
        <textarea
          value={notes || ""}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write or paste anything here: how to get around, tips and tricks"
          className="w-full bg-transparent resize-none outline-none text-gray-700 placeholder-gray-500 min-h-[120px]"
        />
      </div>
    </div>
  );
};

export default NotesSection;

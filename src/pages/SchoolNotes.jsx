import { useEffect, useState } from 'react';
import axios from 'axios';
import { NotesAISummary } from '@/components/Notes';
import { toast } from 'react-toastify';
import Card from '@/components/Card';
import CreateItem from '@/components/CreateItem';
import { X } from 'lucide-react';

const SchoolNotes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_NOTES_API}/notes`);
      setNotes(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
  };

  const handleCloseDetailView = () => {
    setSelectedNote(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gradient bg-gradient-primary">School Notes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <Card
            key={note._id}
            {...note}
            date={note.date} // Ensure we're passing the date prop
            onSelect={() => handleNoteSelect(note)}
            isSelected={selectedNote && selectedNote._id === note._id}
          />
        ))}
      </div>
      <CreateItem setItems={setNotes} itemType="notes" />
      <NotesAISummary notes={notes} />

      {selectedNote && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-4xl border border-base-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gradient bg-gradient-secondary">{selectedNote.title}</h2>
              <button onClick={handleCloseDetailView} className="btn btn-ghost btn-circle">
                <X size={24} />
              </button>
            </div>
            {selectedNote.image && (
              <img src={selectedNote.image} alt={selectedNote.title} className="w-full h-64 object-cover rounded-lg mb-4" />
            )}
            <p className="text-sm text-base-content/70 mb-2">{selectedNote.author}</p>
            <p className="mb-4">{selectedNote.content}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedNote.tags && selectedNote.tags.map(tag => (
                <span key={tag} className="badge badge-primary">{tag}</span>
              ))}
            </div>
            <p className="text-sm text-base-content/70">
              Created: {new Date(selectedNote.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolNotes;

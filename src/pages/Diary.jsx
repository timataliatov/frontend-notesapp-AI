import { useState, useEffect } from 'react';
import axios from 'axios';
import { MoodAIAnalysis } from '@/components/Diary';
import Card from '@/components/Card';
import CreateItem from '@/components/CreateItem';
import { toast } from 'react-toastify';

const Diary = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_NOTES_API}/entries`);
      setEntries(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEntrySelect = (entry) => {
    setSelectedEntry(entry);
    setShowAnalysisModal(true);
  };

  const handleAnalysisComplete = async (mood) => {
    try {
      const updatedEntry = { ...selectedEntry, mood };
      await axios.put(`${import.meta.env.VITE_NOTES_API}/entries/${selectedEntry._id}`, updatedEntry);
      setEntries(entries.map(e => e._id === selectedEntry._id ? updatedEntry : e));
      toast.success('Mood analysis completed!');
    } catch (error) {
      toast.error('Failed to save mood analysis');
    }
  };

  const handleCloseAnalysisModal = () => {
    setShowAnalysisModal(false);
    setSelectedEntry(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gradient bg-gradient-primary">My Diary</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map(entry => (
          <Card
            key={entry._id}
            {...entry}
            onSelect={() => handleEntrySelect(entry)}
            isSelected={selectedEntry && selectedEntry._id === entry._id}
          />
        ))}
      </div>
      <CreateItem setItems={setEntries} itemType="entries" />
      {showAnalysisModal && selectedEntry && (
        <MoodAIAnalysis
          note={selectedEntry}
          onAnalysisComplete={handleAnalysisComplete}
          onClose={handleCloseAnalysisModal}
        />
      )}
    </div>
  );
};

export default Diary;

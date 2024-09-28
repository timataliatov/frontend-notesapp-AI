import NoteCard from './NoteCard';

const NotesList = ({ notes }) => {
  if (!notes.length) return <p className='p-5 text-center'>No notes available</p>;

  return (
    <div className='p-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
      {notes.map(n => (
        <NoteCard key={n._id} note={n} />
      ))}
    </div>
  );
};

export default NotesList;

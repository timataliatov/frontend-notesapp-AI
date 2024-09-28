import EntryCard from './EntryCard';

const EntriesList = ({ entries }) => {
  if (!entries.length) return <p className='p-5 text-center'>No diary entries available</p>;

  return (
    <div className='p-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
      {entries.map(e => (
        <EntryCard key={e._id} entry={e} />
      ))}
    </div>
  );
};

export default EntriesList;

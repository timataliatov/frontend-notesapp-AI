import { useRef, useState } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';

const CreateEntry = ({ setEntries }) => {
  const modalRef = useRef(null);
  const [{ title, author, image, content }, setForm] = useState({
    title: '',
    author: '',
    image: '',
    content: ''
  });

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!author || !image || !content) return toast.error('Please fill in all fields');
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_NOTES_API}/entries`, {
        title,
        author,
        image,
        content
      });
      setEntries(prev => [data, ...prev]);
      setForm({ title: '', author: '', image: '', content: '' });
      modalRef.current.close();
      toast.success('Entry created successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <button
        onClick={() => modalRef.current.showModal()}
        className="fixed bottom-4 right-4 btn btn-primary btn-circle text-3xl shadow-lg"
      >
        <Plus />
      </button>
      <dialog id="modal-note" className="modal modal-bottom sm:modal-middle" ref={modalRef}>
        <div className="modal-box bg-gradient-background">
          <h3 className="font-bold text-lg text-gradient bg-gradient-primary">Create a new diary entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={title}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Author"
              name="author"
              value={author}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Image URL"
              name="image"
              value={image}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            <textarea
              placeholder="Content"
              name="content"
              value={content}
              onChange={handleChange}
              className="textarea textarea-bordered w-full h-32"
            ></textarea>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Create</button>
              <form method="dialog">
                <button className="btn btn-ghost">Close</button>
              </form>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default CreateEntry;

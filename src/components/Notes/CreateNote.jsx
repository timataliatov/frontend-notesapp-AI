import { useRef, useState } from 'react';
import axios from 'axios';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';


const CreateNote = ({ setNotes }) => {
  const modalRef = useRef(null);
  const [{ title, author, image, content }, setForm] = useState({
    title: '',
    author: '',
    image: '',
    content: '',
  });
  const [newTag, setNewTag] = useState('');

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !content) return toast.error('Please fill in all required fields');
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_NOTES_API}/notes`, {
        title,
        author,
        image,
        content,
        tags
      });
      setNotes(prev => [data, ...prev]);
      setForm({ title: '', author: '', image: '', content: '', tags: [] });
      modalRef.current.close();
      toast.success('Note created successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const generateRandomImage = async () => {
    try {
      const response = await axios.get('https://source.unsplash.com/random');
      setForm(prev => ({ ...prev, image: response.request.responseURL }));
    } catch (error) {
      toast.error('Failed to generate random image');
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  return (
    <>
      <button
        onClick={() => modalRef.current.showModal()}
        className="fixed bottom-4 right-4 btn btn-primary btn-circle text-3xl shadow-lg "
      >
        <Plus />
      </button>
      <dialog id="modal-note" className="modal modal-bottom sm:modal-middle" ref={modalRef}>
        <div className="modal-box bg-gradient-background">
          <h3 className="font-bold text-lg text-gradient bg-gradient-secondary">Create a new note</h3>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <input
              type="text"
              placeholder="Title *"
              name="title"
              value={title}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              placeholder="Author"
              name="author"
              value={author}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL"
                name="image"
                value={image}
                onChange={handleChange}
                className="input input-bordered flex-grow"
              />
              <button
                type="button"
                onClick={generateRandomImage}
                className="btn btn-secondary"
              >
                <ImageIcon size={20} />
              </button>
            </div>
            <textarea
              placeholder="Content *"
              name="content"
              value={content}
              onChange={handleChange}
              className="textarea textarea-bordered w-full h-32"
              required
            ></textarea>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="input input-bordered flex-grow"
              />
              <button type="button" onClick={addTag} className="btn btn-secondary">
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap">
              {tags.map(tag => (
                <Tag key={tag} tag={tag} onRemove={removeTag} />
              ))}
            </div>
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

export default CreateNote;

import React, { useState } from 'react';
import axios from 'axios';
import { Plus, X, Sparkles, Loader, Image } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/utils/api';

const CreateItem = ({ setItems, itemType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    author: '',
    image: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error('Please fill in all required fields');
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_NOTES_API}/${itemType}`, {
        ...form,
        createdAt: new Date().toISOString()
      });
      setItems(prev => [data, ...prev]);
      setForm({ title: '', author: '', image: '', content: '' });
      setIsOpen(false);
      toast.success(`${itemType === 'notes' ? 'Note' : 'Entry'} created successfully!`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const generateRandomContent = async () => {
    setLoading(true);
    try {
      const generatedContent = await api.generateRandomContent(itemType);
      setForm(generatedContent);
    } catch (error) {
      console.error('Error generating random content:', error);
      toast.error('Failed to generate random content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://source.unsplash.com/random?${form.title}`);
      setForm(prev => ({ ...prev, image: response.request.responseURL }));
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 btn btn-circle btn-lg bg-gradient-to-r from-accent-300 to-primary-400 text-primary-content shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110"
      >
        <Plus size={40} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary to-secondary">
                Create a new {itemType === 'notes' ? 'note' : 'entry'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-circle"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title *"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                placeholder="Author"
                name="author"
                value={form.author}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  placeholder="Image URL"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
                <button
                  type="button"
                  onClick={generateImage}
                  className="btn btn-circle btn-primary"
                  disabled={loading}
                >
                  <Image size={20} />
                </button>
              </div>
              <textarea
                placeholder="Content *"
                name="content"
                value={form.content}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-32"
                required
              ></textarea>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={generateRandomContent}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={20} className="mr-2" />
                      AI Generate
                    </>
                  )}
                </button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateItem;

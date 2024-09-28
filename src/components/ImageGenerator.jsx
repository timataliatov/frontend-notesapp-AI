import React, { useState } from 'react';
import axios from 'axios';
import { Image, Loader } from 'lucide-react';
import { toast } from 'react-toastify';

const ImageGenerator = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      // This is a placeholder. In a real application, you'd call your image generation API here.
      const response = await axios.get(`https://source.unsplash.com/random?${prompt}`);
      onImageGenerated(response.request.responseURL);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Enter image prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="input input-bordered flex-grow"
      />
      <button
        onClick={generateImage}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? <Loader className="animate-spin" /> : <Image />}
      </button>
    </div>
  );
};

export default ImageGenerator;

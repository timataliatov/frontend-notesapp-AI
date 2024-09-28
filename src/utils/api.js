import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PROXY_OPENAI,
  headers: {
    'Content-Type': 'application/json',
    'provider': import.meta.env.VITE_PROVIDER,
    'mode': import.meta.env.VITE_MODE
  }
});

api.interceptors.request.use((config) => {
  if (config.data && config.data.stream) {
    config.responseType = 'stream';
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config.responseType === 'stream') {
      return response;
    }
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Add this new method
api.generateRandomContent = async (itemType) => {
  const systemMessage = `You are a snarky web dev expert creating ${itemType} with dark humor.
  Respond with a JSON object:
  {
    "title": "Witty, tech-related title (max 50 chars)",
    "author": "Fictional dev name with a pun",
    "image": "https://picsum.photos/1280/640",
    "content": "Dark, humorous web dev anecdote or observation (max 300 chars)"
  }`;

  const prompt = itemType === 'notes'
    ? "Create a sardonic web dev note about a trending technology or common frustration."
    : "Write a cynical diary entry about a web developer's recent project disaster or debugging nightmare.";

  const response = await api.post('/chat/completions', {
    model: import.meta.env.VITE_MODEL,
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt }
    ],
  });

  // Extract JSON from the response
  const jsonMatch = response.choices[0].message.content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  } else {
    throw new Error('Failed to parse JSON from API response');
  }
};

export default api;

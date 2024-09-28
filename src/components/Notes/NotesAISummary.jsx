import React, { useState, useCallback, useMemo } from 'react';
import api from '@/utils/api';
import { toast } from 'react-toastify';
import { Sparkles, X, Loader2, Send, BookOpen, MessageCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import StreamingText from '@/components/StreamingText';

const useRateLimit = (limit, interval) => {
  const [calls, setCalls] = useState([]);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const recentCalls = calls.filter(time => now - time < interval);
    if (recentCalls.length >= limit) {
      return false;
    }
    setCalls([...recentCalls, now]);
    return true;
  }, [calls, limit, interval]);

  return checkRateLimit;
};

const NotesAISummary = ({ notes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [isChatStreaming, setIsChatStreaming] = useState(true);

  const checkRateLimit = useRateLimit(1, 60000);

  const notesText = useMemo(() => notes.map(note => `${note.title}: ${note.content}`).join('\n\n'), [notes]);

  const handleAISummary = useCallback(async () => {
    if (!checkRateLimit()) {
      toast.error('Rate limit exceeded. Please try again in a minute.');
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const response = await api.post('/chat/completions', {
        model: import.meta.env.VITE_MODEL,
        messages: [
          { role: "system", content: "You are a concise note summarizer. Provide brief, focused summaries of school notes. Use short sentences and limit the summary to 3-5 key points. Use Markdown '##' for main topics only." },
          { role: "user", content: `Please provide a brief summary of these school notes, focusing on the most important points:\n\n${notesText}` }
        ],
      });

      setSummary(response.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching AI summary:', error);
      toast.error('Failed to generate summary. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [notesText, checkRateLimit]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = { role: 'user', content: userInput };
    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');

    try {
      const response = await api.post('/chat/completions', {
        model: import.meta.env.VITE_MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant that answers questions about the user's notes. You're answers should be concise and to the point. Don't use markdown. Just chat with the user like a friend." },
          ...chatMessages,
          newMessage
        ],
      });

      const aiResponse = { role: 'assistant', content: response.choices[0].message.content };
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Failed to get AI response. Please try again.');
    }
  };

  const formatSummary = (text) => {
    return text
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 text-primary">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-4 mb-2 text-secondary">$1</h3>')
      .replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2 list-disc">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/`([^`]+)`/g, '<code class="bg-base-300 text-base-content px-1 py-0.5 rounded">$1</code>');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-20 btn btn-circle btn-lg bg-gradient-to-r from-primary-300 to-accent-400 text-primary-content shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Open AI summary and chat"
      >
        <Sparkles size={28} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-xl shadow-2xl w-11/12 h-5/6 max-w-7xl flex flex-col overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                AI-Powered Notes Assistant
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-circle text-base-content hover:bg-base-200 transition-colors duration-300"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow flex overflow-hidden p-6 gap-6">
              {/* Summary Section */}
              <div className="w-1/2 flex flex-col bg-base-200 rounded-xl shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-primary/10">
                  <h3 className="text-xl font-semibold flex items-center">
                    <BookOpen size={24} className="mr-2 text-primary-300" />
                    Summary
                  </h3>
                  <button
                    onClick={() => setIsStreaming(!isStreaming)}
                    className="btn btn-ghost btn-sm"
                    aria-label={isStreaming ? "Turn off streaming" : "Turn on streaming"}
                  >
                    {isStreaming ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                </div>
                <div className="flex-grow p-6 overflow-y-auto prose max-w-none">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 size={48} className="animate-spin text-primary" />
                    </div>
                  ) : summary ? (
                    isStreaming ? (
                      <StreamingText
                        text={summary}
                        speed={5}
                        onComplete={() => {}}
                      />
                    ) : (
                      <div className="text-base-content" dangerouslySetInnerHTML={{ __html: formatSummary(summary) }} />
                    )
                  ) : (
                    <p className="text-base-content/50 text-center">AI summary will appear here</p>
                  )}
                </div>
                <button
                  className="btn m-4 bg-gradient-to-r from-primary-600 to-secondary-400 text-primary-content border-none hover:from-primary-400/70 hover:to-secondary-300/70 transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={handleAISummary}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} className="mr-2" />
                      Generate AI Summary
                    </>
                  )}
                </button>
              </div>
              {/* Chat Section */}
              <div className="w-1/2 flex flex-col bg-base-200 rounded-xl shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-secondary/10">
                  <h3 className="text-xl font-semibold flex items-center">
                    <MessageCircle size={24} className="mr-2 text-secondary-300" />
                    Chat with AI
                  </h3>
                  <button
                    onClick={() => setIsChatStreaming(!isChatStreaming)}
                    className="btn btn-ghost btn-sm"
                    aria-label={isChatStreaming ? "Turn off chat streaming" : "Turn on chat streaming"}
                  >
                    {isChatStreaming ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                </div>
                <div
                  className="flex-grow p-6 overflow-y-auto space-y-4"
                  ref={(el) => {
                    if (el) {
                      el.scrollTop = el.scrollHeight;
                    }
                  }}
                >
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'}`}>
                      <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
                        {isChatStreaming && message.role === 'assistant' ? (
                          <StreamingText
                            text={message.content}
                            speed={5}
                            onComplete={() => {}}
                          />
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleChatSubmit} className="flex gap-2 p-4 bg-base-300">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about your notes..."
                    className="input input-bordered flex-grow bg-base-100 focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  />
                  <button type="submit" className="btn btn-circle bg-gradient-to-r from-accent-300 to-secondary-200 text-primary-content border-none hover:from-primary-400/80 hover:to-secondary-400/80 transition-all duration-500 shadow-md hover:shadow-lg">
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(NotesAISummary);

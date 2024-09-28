import React, { useState, useCallback } from 'react';
import api from '@/utils/api';
import { toast } from 'react-toastify';
import { Doughnut } from 'react-chartjs-2';
import { X, CheckCircle, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import StreamingText from '@/components/StreamingText';

ChartJS.register(ArcElement, Tooltip, Legend);

const MoodAIAnalysis = ({ note, onAnalysisComplete, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [isStreaming, setIsStreaming] = useState(true);

  const handleAIAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.post('/chat/completions', {
        model: import.meta.env.VITE_MODEL,
        messages: [
          { role: "system", content: "You are an expert sentiment analyzer specializing in emotional nuances. Analyze the provided text and return a JSON response with the following structure:\n\n{\n  \"scores\": {\n    \"joy\": number,\n    \"sadness\": number,\n    \"anger\": number,\n    \"fear\": number,\n    \"surprise\": number\n  },\n  \"explanation\": string\n}\n\nEnsure each sentiment score is an integer between 0 and 100, representing the intensity of that emotion. The explanation should be a concise, insightful interpretation of the overall emotional tone, limited to 2-3 sentences. Focus on accuracy, nuance, and providing valuable insights into the writer's emotional state. Do not include any additional information or text outside of this JSON structure." },
          { role: "user", content: note.content }
        ],
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0]);
        const sentimentScores = analysisResult.scores;
        const explanation = analysisResult.explanation;

        const newSentimentData = {
          labels: Object.keys(sentimentScores),
          datasets: [{
            data: Object.values(sentimentScores),
            backgroundColor: [
              'rgba(255, 206, 86, 0.8)',   // Joy
              'rgba(54, 162, 235, 0.8)',   // Sadness
              'rgba(255, 99, 132, 0.8)',   // Anger
              'rgba(75, 192, 192, 0.8)',   // Fear
              'rgba(153, 102, 255, 0.8)',  // Surprise
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          }],
        };
        setAnalysisData({ sentimentData: newSentimentData, explanation, scores: sentimentScores });

        // Pass both scores and explanation to the parent component
        onAnalysisComplete(sentimentScores, explanation);
      } else {
        throw new Error('Failed to extract JSON from response');
      }
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
      toast.error('Failed to generate mood analysis. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [note, onAnalysisComplete]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
        labels: {
          color: 'rgba(133, 133, 133, 0.6)',
          font: {
            size: 14,
            family: "'Roboto', sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
        backgroundColor: 'bg-primary',
        titleFont: {
          size: 16,
          family: "'Roboto', sans-serif",
        },
        bodyFont: {
          size: 14,
          family: "'Roboto', sans-serif",
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true
    },
    cutout: '70%',
  };

  const chartColors = [
    'rgba(255, 206, 86, 0.8)',   // Joy
    'rgba(54, 162, 235, 0.8)',   // Sadness
    'rgba(255, 99, 132, 0.8)',   // Anger
    'rgba(75, 192, 192, 0.8)',   // Fear
    'rgba(153, 102, 255, 0.8)',  // Surprise
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-4xl border border-base-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-neutral">Mood Analysis for &quot;{note.title}&quot;</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-primary transition-colors">
            <X size={24} />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 size={48} className="animate-spin text-primary" />
          </div>
        ) : analysisData ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
                <div className="w-full h-full relative text-neutral pt-4">
                  <Doughnut
                    data={{
                      ...analysisData.sentimentData,
                      datasets: [{
                        ...analysisData.sentimentData.datasets[0],
                        backgroundColor: chartColors,
                        borderColor: chartColors.map(color => color.replace('0.8', '1')),
                        borderWidth: 2,
                      }],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="p-6 text-neutral">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-neutral">Explanation</h3>
                  <button
                    onClick={() => setIsStreaming(!isStreaming)}
                    className="btn btn-ghost btn-sm text-neutral"
                    aria-label={isStreaming ? "Turn off streaming" : "Turn on streaming"}
                  >
                    {isStreaming ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                </div>
                {isStreaming ? (
                  <StreamingText
                    text={analysisData.explanation}
                    speed={5}
                    onComplete={() => {}}
                  />
                ) : (
                  <p className="text-neutral">{analysisData.explanation}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64">
              <img src={note.image} alt={note.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-neutral">{note.title}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-base-content/70">
                <span>{note.author}</span>
                <span>{new Date(note.date).toLocaleDateString()}</span>
              </div>
              <div className="divider my-2"></div>
              <p className="text-base-content leading-relaxed">{note.content}</p>
            </div>
          </div>
        )}
        {analysisData ? (
          <button
            className="btn btn-success w-full mt-6 text-lg font-semibold"
            onClick={onClose}
          >
            <CheckCircle className="mr-2" /> Save and Close
          </button>
        ) : (
          <button
            className="btn btn-primary w-full mt-6 text-lg font-semibold"
            onClick={handleAIAnalysis}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Mood'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MoodAIAnalysis;

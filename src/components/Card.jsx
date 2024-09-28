import React from 'react';
import { Smile, Frown, Meh, Flame, Cloud } from 'lucide-react';
import Tag from '@/components/Tag';

const moodEmojis = {
  joy: <Smile className="text-yellow-400" />,
  sadness: <Frown className="text-blue-400" />,
  anger: <Flame className="text-red-400" />,
  fear: <Cloud className="text-gray-400" />,
  surprise: <Meh className="text-purple-400" />
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  }
};

const Card = ({ title, author, content, date, mood, image, tags, onSelect, isSelected, moodAnalysis }) => {
  const highestEmotion = mood ? Object.entries(mood).reduce((a, b) => a[1] > b[1] ? a : b)[0] : null;

  return (
    <div
      className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
    >
      {image && (
        <figure className="px-4 pt-4">
          <img src={image} alt={title} className="rounded-xl h-48 w-full object-cover" />
        </figure>
      )}
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-gradient bg-gradient-primary">{title}</h2>
          {mood && moodEmojis[highestEmotion]}
        </div>
        {author && <p className="text-sm text-base-content/70">{author}</p>}
        <p className="mt-2 overflow-hidden text-ellipsis">
          {moodAnalysis ? (
            <>
              <strong>Mood Analysis:</strong> {moodAnalysis}
            </>
          ) : (
            content.length > 100 ? `${content.slice(0, 100)}...` : content
          )}
        </p>
        <div className="flex flex-wrap mt-2">
          {tags && tags.map(tag => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
        <div className="card-actions justify-end items-center mt-4">
          <span className="text-sm text-base-content/70">
            {formatDate(date)} ({new Date(date).toLocaleDateString()})
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;

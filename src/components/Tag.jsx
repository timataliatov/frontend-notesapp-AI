import React from 'react';
import { X } from 'lucide-react';

const Tag = ({ tag, onRemove }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-content mr-2 mb-2">
    {tag}
    {onRemove && (
      <button onClick={() => onRemove(tag)} className="ml-1 focus:outline-none">
        <X size={14} />
      </button>
    )}
  </span>
);

export default Tag;

import React from 'react';
import './NoteModal.css';

const NoteModal = ({ isOpen, onClose, note }) => {
  if (!isOpen || !note) return null;

  return (
    <div className="note-modal-overlay backdrop-blur-sm" onClick={onClose}>
      <div className="note-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="note-modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>{note.title}</h2>
        <p className="note-modal-date">{new Date(note.date).toLocaleDateString()}</p>
        <p className="note-modal-subject">{note.subject}</p>
        <div className="note-modal-content-text">{note.content}</div>
        {note.tags && note.tags.length > 0 && (
          <div className="note-modal-tags">
            {note.tags.map((tag, index) => (
              <span key={index} className="note-modal-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteModal;

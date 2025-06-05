import React, { useState } from 'react';
import { FaArrowRight, FaCut } from 'react-icons/fa';

interface ContentInputProps {
  onSubmit: (content: string) => void;
}

const ContentInput = ({ onSubmit }: ContentInputProps) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  
  const MAX_CHARS = 2500;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter some content to generate a quiz.');
      return;
    }
    
    if (content.length > MAX_CHARS) {
      const excessChars = content.length - MAX_CHARS;
      setError(`Content exceeds maximum length by ${excessChars} characters. Please remove at least ${excessChars} characters.`);
      return;
    }
    
    if (content.length < 100) {
      setError('Content is too short. Please enter at least 100 characters for meaningful quiz generation.');
      return;
    }
    
    setError('');
    onSubmit(content);
  };
  
  const handleAutoTrim = () => {
    if (content.length > MAX_CHARS) {
      // Trim the content to the maximum allowed length
      const trimmedContent = content.substring(0, MAX_CHARS);
      setContent(trimmedContent);
      setError('');
    }
  };
  
  const getCharCountClass = () => {
    if (content.length > MAX_CHARS) return 'text-red-600 font-medium';
    if (content.length > MAX_CHARS * 0.9) return 'text-amber-600';
    return 'text-secondary-500';
  };
  
  return (
    <div className="card">
      <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-4">Create a Quiz</h2>
      
      <p className="text-secondary-600 mb-6">
        Enter your study content below, and we'll generate quiz questions to help you test your knowledge.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-secondary-700 mb-2">
            Study Content
          </label>
          <textarea
            id="content"
            rows={10}
            className={`input ${content.length > MAX_CHARS ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Paste your study notes, article, or any text content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          
          <div className="mt-2 flex justify-between items-center text-sm">
            <div>
              {error && <p className="text-red-600">{error}</p>}
              {!error && content.length > MAX_CHARS * 0.9 && content.length <= MAX_CHARS && (
                <p className="text-amber-600">You're approaching the character limit.</p>
              )}
              {!error && content.length > 0 && content.length < 100 && (
                <p className="text-amber-600">Add more content for better quiz generation (minimum 100 characters).</p>
              )}
            </div>
            <div className={getCharCountClass()}>
              {content.length} / {MAX_CHARS}
              {content.length > MAX_CHARS && (
                <span className="ml-2">
                  (Excess: {content.length - MAX_CHARS})
                </span>
              )}
            </div>
          </div>
          
          {content.length > MAX_CHARS && (
            <div className="mt-3">
              <button
                type="button"
                onClick={handleAutoTrim}
                className="btn btn-secondary flex items-center text-sm"
              >
                <FaCut className="mr-2" />
                Auto-trim excess characters
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="btn btn-primary flex items-center"
            disabled={!content.trim() || content.length > MAX_CHARS || content.length < 100}
          >
            Generate Quiz
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
      
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-secondary-900 mb-3">Tips for Better Quizzes</h3>
        <ul className="list-disc pl-5 space-y-2 text-secondary-600">
          <li>Include detailed information with specific facts and concepts</li>
          <li>Use clear, concise language</li>
          <li>Break complex topics into smaller sections</li>
          <li>Include definitions, processes, and key terminology</li>
          <li>Proofread your content to ensure accuracy</li>
          <li>Aim for at least 300-500 characters for diverse question types</li>
        </ul>
      </div>
    </div>
  );
};

export default ContentInput;

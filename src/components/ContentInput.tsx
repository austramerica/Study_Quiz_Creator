import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

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
      setError(`Content exceeds maximum length of ${MAX_CHARS} characters.`);
      return;
    }
    
    setError('');
    onSubmit(content);
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
            className="input"
            placeholder="Paste your study notes, article, or any text content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          
          <div className="mt-2 flex justify-between items-center text-sm">
            <div>
              {error && <p className="text-red-600">{error}</p>}
            </div>
            <div className={`${content.length > MAX_CHARS ? 'text-red-600' : 'text-secondary-500'}`}>
              {content.length} / {MAX_CHARS}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="btn btn-primary flex items-center"
            disabled={!content.trim() || content.length > MAX_CHARS}
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
        </ul>
      </div>
    </div>
  );
};

export default ContentInput;

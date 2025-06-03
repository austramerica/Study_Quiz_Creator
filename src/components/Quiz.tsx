import { useState } from 'react';
import { Question } from '../types';
import { FaRedo, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';

interface QuizProps {
  questions: Question[];
  onRestart: () => void;
  onCreateNew: () => void;
}

const Quiz = ({ questions, onRestart, onCreateNew }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  if (questions.length === 0) {
    return (
      <div className="card text-center py-8">
        <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-4">No Questions Available</h2>
        <p className="text-secondary-600 mb-6">
          We couldn't generate any questions from the provided content. Please try again with different content.
        </p>
        <button onClick={onCreateNew} className="btn btn-primary">
          Create New Quiz
        </button>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer
    });
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };
  
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="card">
        <h2 className="text-2xl font-heading font-semibold text-secondary-900 mb-4">Quiz Results</h2>
        
        <div className="bg-secondary-50 p-6 rounded-lg mb-6 text-center">
          <h3 className="text-xl font-medium text-secondary-900 mb-2">Your Score</h3>
          <div className="text-4xl font-bold text-primary-600 mb-2">{score} / {questions.length}</div>
          <div className="text-lg text-secondary-700">{percentage}%</div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-secondary-900 mb-3">Question Review</h3>
          
          {questions.map((question, index) => {
            const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
            
            return (
              <div key={question.id} className="mb-4 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 rounded-full p-1 ${isCorrect ? 'bg-green-100' : 'bg-red-100'} mr-3`}>
                    {isCorrect ? (
                      <FaCheck className="h-4 w-4 text-green-600" />
                    ) : (
                      <FaTimes className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-secondary-900 font-medium">Question {index + 1}: {question.text}</p>
                    <p className="text-sm mt-1">
                      <span className="text-secondary-600">Your answer: </span>
                      <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {selectedAnswers[question.id] || 'Not answered'}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm mt-1">
                        <span className="text-secondary-600">Correct answer: </span>
                        <span className="text-green-600 font-medium">{question.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => {
              setCurrentQuestionIndex(0);
              setSelectedAnswers({});
              setShowResults(false);
              onRestart();
            }} 
            className="btn btn-outline flex items-center justify-center"
          >
            <FaRedo className="mr-2" />
            Restart Quiz
          </button>
          <button 
            onClick={onCreateNew} 
            className="btn btn-primary flex items-center justify-center"
          >
            <FaPlus className="mr-2" />
            Create New Quiz
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-semibold text-secondary-900">Question {currentQuestionIndex + 1} of {questions.length}</h2>
        <div className="text-sm font-medium text-secondary-500">
          {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
        </div>
      </div>
      
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-medium text-secondary-900 mb-4">{currentQuestion.text}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion.id] === option;
            const optionLabel = String.fromCharCode(97 + index); // a, b, c, d, e
            
            return (
              <div 
                key={index}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-200 hover:bg-primary-50/50'
                }`}
                onClick={() => handleAnswerSelect(option)}
              >
                <div className="flex items-center">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                    isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-secondary-600'
                  }`}>
                    {optionLabel}
                  </div>
                  <span className="text-secondary-900">{option}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`btn btn-outline ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </button>
        <button 
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestion.id]}
          className={`btn btn-primary ${!selectedAnswers[currentQuestion.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;

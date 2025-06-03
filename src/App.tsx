import { useState } from 'react';
import ContentInput from './components/ContentInput';
import Quiz from './components/Quiz';
import { generateQuiz } from './utils/quizGenerator';
import { Question } from './types';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [_, setContent] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);

  const handleContentSubmit = (text: string) => {
    setContent(text);
    const generatedQuestions = generateQuiz(text);
    setQuestions(generatedQuestions);
    setIsQuizStarted(true);
  };

  const handleRestartQuiz = () => {
    setIsQuizStarted(true);
  };

  const handleCreateNewQuiz = () => {
    setContent('');
    setQuestions([]);
    setIsQuizStarted(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {!isQuizStarted ? (
          <ContentInput onSubmit={handleContentSubmit} />
        ) : (
          <Quiz 
            questions={questions} 
            onRestart={handleRestartQuiz}
            onCreateNew={handleCreateNewQuiz}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;

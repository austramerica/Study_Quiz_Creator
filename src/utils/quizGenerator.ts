import { Question } from '../types';

export function generateQuiz(content: string): Question[] {
  // Simple implementation to generate quiz questions from content
  const questions: Question[] = [];
  
  // Split content into sentences (very basic approach)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Generate up to 5 questions
  const numQuestions = Math.min(5, sentences.length);
  
  for (let i = 0; i < numQuestions; i++) {
    const sentence = sentences[i].trim();
    
    // Create a question by removing a key word
    const words = sentence.split(' ').filter(w => w.length > 4);
    
    if (words.length > 3) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const removedWord = words[randomIndex];
      
      // Replace the word with a blank
      const questionText = sentence.replace(removedWord, '_______');
      
      // Generate options (including the correct answer)
      const options = [
        removedWord,
        generateFakeOption(words, removedWord),
        generateFakeOption(words, removedWord),
        generateFakeOption(words, removedWord),
        generateFakeOption(words, removedWord)
      ];
      
      // Shuffle options
      shuffleArray(options);
      
      questions.push({
        id: i + 1,
        text: questionText,
        options: options,
        correctAnswer: removedWord
      });
    }
  }
  
  return questions;
}

function generateFakeOption(words: string[], correctWord: string): string {
  // Very simple fake option generator
  const fakeWords = [
    'process', 'energy', 'system', 'function', 'structure',
    'element', 'reaction', 'component', 'factor', 'molecule',
    'theory', 'concept', 'method', 'analysis', 'development',
    'research', 'experiment', 'observation', 'hypothesis', 'conclusion'
  ];
  
  // Try to use a word from the content first
  if (words.length > 5) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    if (randomWord !== correctWord && randomWord.length > 3) {
      return randomWord;
    }
  }
  
  // Otherwise use a generic word
  return fakeWords[Math.floor(Math.random() * fakeWords.length)];
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

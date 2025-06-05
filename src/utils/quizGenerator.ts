import { Question, QuizHistory } from '../types';

// Store quiz history to prevent repeating questions
const quizHistoryStore: QuizHistory[] = [];

// Simple hash function for content
function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

// Check if a question is already used for similar content
function isQuestionUsed(contentHash: string, questionId: number): boolean {
  const history = quizHistoryStore.find(h => h.contentHash === contentHash);
  return history ? history.questionIds.includes(questionId) : false;
}

// Add question to history
function addQuestionToHistory(contentHash: string, questionId: number): void {
  const historyIndex = quizHistoryStore.findIndex(h => h.contentHash === contentHash);
  
  if (historyIndex >= 0) {
    quizHistoryStore[historyIndex].questionIds.push(questionId);
  } else {
    quizHistoryStore.push({
      contentHash,
      questionIds: [questionId]
    });
  }
  
  // Limit history size
  if (quizHistoryStore.length > 10) {
    quizHistoryStore.shift();
  }
}

export function generateQuiz(content: string): Question[] {
  const questions: Question[] = [];
  const contentHash = hashContent(content);
  
  // Split content into sentences (improved approach)
  const sentences = content
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 15); // Ensure sentences are substantial
  
  if (sentences.length < 3) {
    return questions; // Not enough content to generate meaningful questions
  }
  
  // Extract all significant words from the content for use as options
  const allWords = extractSignificantWords(content);
  
  // Track used words to avoid duplicates
  const usedWords = new Set<string>();
  
  // Generate up to 15 candidate questions (will select 5 later)
  const candidateQuestions: Question[] = [];
  let questionId = 1;
  
  // Generate fill-in-blank questions only
  for (let i = 0; i < Math.min(30, sentences.length); i++) {
    const sentence = sentences[i];
    
    // Create a question by removing a key word
    const words = sentence.split(' ')
      .filter(w => w.length > 4)
      .filter(w => !w.match(/^[0-9]+$/)); // Filter out numbers
    
    if (words.length > 3) {
      // Try different words in the sentence to find one that hasn't been used
      for (let attempt = 0; attempt < Math.min(3, words.length); attempt++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const removedWord = words[randomIndex].replace(/[^a-zA-Z]/g, ''); // Clean the word
        
        // Skip if word is too short after cleaning or already used
        if (removedWord.length < 4 || usedWords.has(removedWord.toLowerCase())) {
          continue;
        }
        
        // Skip if this question was used before for similar content
        if (isQuestionUsed(contentHash, questionId)) {
          questionId++;
          continue;
        }
        
        usedWords.add(removedWord.toLowerCase());
        
        // Replace the word with a blank
        const questionText = sentence.replace(new RegExp(`\\b${removedWord}\\b`, 'i'), '_______');
        
        // Generate options (including the correct answer) from words in the text
        const options = generateOptionsFromText(removedWord, allWords, usedWords);
        
        candidateQuestions.push({
          id: questionId,
          text: questionText,
          options: options,
          correctAnswer: removedWord,
          type: 'fillInBlank'
        });
        
        addQuestionToHistory(contentHash, questionId);
        questionId++;
        break;
      }
    }
  }
  
  // Shuffle and select up to 5 questions
  shuffleArray(candidateQuestions);
  questions.push(...candidateQuestions.slice(0, 5));
  
  // Renumber questions for consistency
  questions.forEach((q, index) => {
    q.id = index + 1;
  });
  
  return questions;
}

// Extract significant words from the content
function extractSignificantWords(content: string): string[] {
  // Split content into words
  const words = content
    .split(/\s+/)
    .map(word => word.replace(/[^a-zA-Z]/g, ''))
    .filter(word => word.length > 4) // Only words longer than 4 characters
    .filter(word => !commonWords.includes(word.toLowerCase())); // Filter out common words
  
  // Remove duplicates
  return Array.from(new Set(words));
}

function generateOptionsFromText(correctAnswer: string, allWords: string[], usedWords: Set<string>): string[] {
  // Start with the correct answer
  const options = [correctAnswer];
  
  // Shuffle the available words
  const availableWords = allWords.filter(word => 
    word.toLowerCase() !== correctAnswer.toLowerCase() && 
    !usedWords.has(word.toLowerCase()) &&
    Math.abs(word.length - correctAnswer.length) <= 3 // Similar length to correct answer
  );
  
  shuffleArray(availableWords);
  
  // Add unique options from the text
  for (const word of availableWords) {
    if (options.length >= 5) break;
    
    // Skip if word is too similar to correct answer or already in options
    if (
      options.some(opt => opt.toLowerCase() === word.toLowerCase()) ||
      word.toLowerCase().includes(correctAnswer.toLowerCase()) ||
      correctAnswer.toLowerCase().includes(word.toLowerCase())
    ) {
      continue;
    }
    
    options.push(word);
    usedWords.add(word.toLowerCase());
  }
  
  // If we don't have enough options from the text, add some from our word pool
  while (options.length < 5) {
    const wordPool = [
      'process', 'system', 'function', 'structure', 'element', 
      'component', 'factor', 'theory', 'concept', 'method', 
      'analysis', 'development', 'research', 'experiment', 'observation',
      'hypothesis', 'conclusion', 'knowledge', 'information', 'data'
    ];
    
    const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    
    if (!options.includes(randomWord) && !usedWords.has(randomWord.toLowerCase())) {
      options.push(randomWord);
      usedWords.add(randomWord.toLowerCase());
    }
  }
  
  // Shuffle options
  shuffleArray(options);
  
  return options;
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// List of common words to exclude from options
const commonWords = [
  'about', 'above', 'after', 'again', 'against', 'all', 'and', 'any', 'are', 'because',
  'been', 'before', 'being', 'below', 'between', 'both', 'but', 'can', 'did', 'does',
  'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has',
  'have', 'having', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'into', 'its', 'itself', 'just', 'more', 'most', 'myself', 'nor', 'not', 'now',
  'off', 'once', 'only', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
  'under', 'until', 'very', 'was', 'were', 'what', 'when', 'where', 'which', 'while',
  'who', 'whom', 'why', 'will', 'with', 'you', 'your', 'yours', 'yourself', 'yourselves'
];

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  type: 'fillInBlank' | 'generalKnowledge';
}

export interface QuizHistory {
  contentHash: string;
  questionIds: number[];
}

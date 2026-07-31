export interface ExamSubmitResponse {
  submission: Submission;
  analytics: Analytic[];
}
export interface Submission {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  exam: Exam;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  startedAt: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  title: string;
  duration: number;
}

export interface Analytic {
  questionId: string;
  questionText: string;
  selectedAnswer: SelectedAnswer | null;
  isCorrect: boolean;
  correctAnswer: CorrectAnswer;
}

export interface SelectedAnswer {
  id: string;
  text: string;
}

export interface CorrectAnswer {
  id: string;
  text: string;
}

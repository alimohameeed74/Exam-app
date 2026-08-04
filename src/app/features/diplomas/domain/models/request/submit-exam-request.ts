export interface SubmitExamRequest {
  examId: string;
  startedAt: string;
  answers: ExamAnswer[];
}

export interface ExamAnswer {
  questionId: string;
  answerId: string;
}

import { DiplomaExamResponse } from './diploma-exam-response.js';

export interface DiplomaResponse {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  exams: DiplomaExamResponse[];
}

export interface ExamFullDetails {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: number;
  diplomaId: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  diploma: Diploma_;
  questionsCount: number;
}

export interface Diploma_ {
  id: string;
  title: string;
  description: string;
  image: string;
}

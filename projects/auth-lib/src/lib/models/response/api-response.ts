export interface ApiResponse<T> {
  code: number;
  status: boolean;
  payload: T;
}

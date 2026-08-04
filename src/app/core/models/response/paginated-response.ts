import { PaginationMetaData } from './pagination-meta-data.js';

export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginationMetaData;
}

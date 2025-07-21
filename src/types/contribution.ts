export type Visibility = 'PUBLIC' | 'PRIVATE' | 'ARCHIVED';

export interface Contribution {
  id: string;
  title: string;
  sector: string;
  author: string;
  visibility: Visibility;
  createdAt: string;
}

export interface Card {
  id: number;
  columnId: number;
  title: string;
  description?: string;
  label?: string;
  position: number;
  completed: boolean;
  createdAt: string;
}

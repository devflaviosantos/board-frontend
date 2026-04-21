import { Card } from './card.model';

export interface Column {
  id: number;
  boardId: number;
  name: string;
  position: number;
  cards: Card[];
}

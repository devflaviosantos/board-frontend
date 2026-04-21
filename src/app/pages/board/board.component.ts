import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Column } from '../../models/column.model';
import { Card } from '../../models/card.model';
import { Board } from '../../models/board.model';
import { BoardService } from '../../services/board.service';
import { ColumnService } from '../../services/column.service';
import { CardService } from '../../services/card.service';

interface ColumnUI extends Column {
  showAddCard: boolean;
  newCardTitle: string;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  board: Board | null = null;
  columns: ColumnUI[] = [];
  showAddColumn = false;
  newColumnName = '';

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private columnService: ColumnService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.boardService.getBoards().subscribe({
      next: boards => (this.board = boards.find(b => b.id === id) ?? null),
      error: err => console.error(err)
    });
    this.columnService.getColumns(id).subscribe({
      next: cols => {
        this.columns = cols
          .sort((a, b) => a.position - b.position)
          .map(col => ({
            ...col,
            cards: col.cards.sort((a, b) => a.position - b.position),
            showAddCard: false,
            newCardTitle: ''
          }));
      },
      error: err => console.error(err)
    });
  }

  get boardId(): number {
    return this.board?.id ?? Number(this.route.snapshot.paramMap.get('id'));
  }

  getCardListIds(): string[] {
    return this.columns.map(col => 'col-' + col.id);
  }

  addColumn(): void {
    const name = this.newColumnName.trim();
    if (!name) return;
    this.columnService.createColumn(this.boardId, name).subscribe({
      next: col => {
        this.columns.push({ ...col, cards: [], showAddCard: false, newCardTitle: '' });
        this.newColumnName = '';
        this.showAddColumn = false;
      },
      error: err => console.error(err)
    });
  }

  deleteColumn(col: ColumnUI): void {
    if (!confirm(`Excluir a coluna "${col.name}"?`)) return;
    this.columnService.deleteColumn(col.id).subscribe({
      next: () => (this.columns = this.columns.filter(c => c.id !== col.id)),
      error: err => console.error(err)
    });
  }

  addCard(col: ColumnUI): void {
    const title = col.newCardTitle.trim();
    if (!title) return;
    this.cardService.createCard(col.id, title).subscribe({
      next: card => {
        col.cards.push(card);
        col.newCardTitle = '';
        col.showAddCard = false;
      },
      error: err => console.error(err)
    });
  }

  deleteCard(col: ColumnUI, card: Card, event: Event): void {
    event.stopPropagation();
    this.cardService.deleteCard(card.id).subscribe({
      next: () => (col.cards = col.cards.filter(c => c.id !== card.id)),
      error: err => console.error(err)
    });
  }

  onCardDrop(event: CdkDragDrop<Card[]>, targetCol: ColumnUI): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const card = event.container.data[event.currentIndex];
      this.cardService.updateCard(card.id, { position: event.currentIndex + 1 }).subscribe({
        error: err => console.error(err)
      });
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const card = event.container.data[event.currentIndex];
      this.cardService.updateCard(card.id, {
        columnId: targetCol.id,
        position: event.currentIndex + 1
      }).subscribe({ error: err => console.error(err) });
    }
  }

  onColumnDrop(event: CdkDragDrop<ColumnUI[]>): void {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    const col = this.columns[event.currentIndex];
    this.columnService.updateColumn(col.id, { position: event.currentIndex + 1 }).subscribe({
      error: err => console.error(err)
    });
  }
}

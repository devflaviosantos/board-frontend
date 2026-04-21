import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Board } from '../../models/board.model';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  boards: Board[] = [];
  showAddForm = false;
  newBoardName = '';

  constructor(private boardService: BoardService, private router: Router) {}

  ngOnInit(): void {
    this.boardService.getBoards().subscribe({
      next: boards => (this.boards = boards),
      error: err => console.error('Erro ao carregar boards:', err)
    });
  }

  openBoard(board: Board): void {
    this.router.navigate(['/board', board.id]);
  }

  createBoard(): void {
    const name = this.newBoardName.trim();
    if (!name) return;
    this.boardService.createBoard(name).subscribe({
      next: board => {
        this.boards.push(board);
        this.newBoardName = '';
        this.showAddForm = false;
      },
      error: err => console.error('Erro ao criar board:', err)
    });
  }

  deleteBoard(board: Board, event: Event): void {
    event.stopPropagation();
    if (!confirm(`Excluir o board "${board.name}"?`)) return;
    this.boardService.deleteBoard(board.id).subscribe({
      next: () => (this.boards = this.boards.filter(b => b.id !== board.id)),
      error: err => console.error('Erro ao excluir board:', err)
    });
  }
}

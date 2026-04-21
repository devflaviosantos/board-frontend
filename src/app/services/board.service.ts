import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private base = `${environment.apiUrl}/api/boards`;

  constructor(private http: HttpClient) {}

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.base);
  }

  createBoard(name: string): Observable<Board> {
    return this.http.post<Board>(this.base, { name });
  }

  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

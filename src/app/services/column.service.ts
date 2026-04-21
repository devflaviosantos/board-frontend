import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Column } from '../models/column.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ColumnService {
  private base = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getColumns(boardId: number): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.base}/boards/${boardId}/columns`);
  }

  createColumn(boardId: number, name: string): Observable<Column> {
    return this.http.post<Column>(`${this.base}/boards/${boardId}/columns`, { name });
  }

  updateColumn(id: number, patch: Partial<Pick<Column, 'name' | 'position'>>): Observable<Column> {
    return this.http.patch<Column>(`${this.base}/columns/${id}`, patch);
  }

  deleteColumn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/columns/${id}`);
  }
}

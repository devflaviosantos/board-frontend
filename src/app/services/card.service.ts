import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../models/card.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CardService {
  private base = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  createCard(columnId: number, title: string): Observable<Card> {
    return this.http.post<Card>(`${this.base}/columns/${columnId}/cards`, { title });
  }

  updateCard(id: number, patch: Partial<Pick<Card, 'title' | 'description' | 'label' | 'position' | 'columnId'>>): Observable<Card> {
    return this.http.patch<Card>(`${this.base}/cards/${id}`, patch);
  }

  deleteCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/cards/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private apiUrl = 'http://localhost:5043/api/quotes';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`
      })
    };
  }

  getQuotes(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  addQuote(quote: any): Observable<any> {
    return this.http.post(this.apiUrl, quote, this.getHeaders());
  }

  updateQuote(quote: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${quote.id}`,
      quote,
      this.getHeaders()
    );
  }

  deleteQuote(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }

}
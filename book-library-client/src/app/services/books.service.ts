import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:5043/api/books';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  addBook(book: any): Observable<any> {
    return this.http.post(this.apiUrl, book, this.getHeaders());
  }

  updateBook(book: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${book.id}`,
      book,
      this.getHeaders()
    );
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }

}
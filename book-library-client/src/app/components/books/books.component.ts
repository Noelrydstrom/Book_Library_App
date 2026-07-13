import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookService } from '../../services/books.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {

  books: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {

    this.bookService.getBooks().subscribe({

      next: (response) => {
        this.books = response;
      },

      error: () => {
        alert("Could not load books.");
      }

    });

  }

}
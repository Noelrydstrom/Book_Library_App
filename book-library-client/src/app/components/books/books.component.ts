import * as bootstrap from 'bootstrap';

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookService } from '../../services/books.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {

  books: any[] = [];

    newBook = {
    title: '',
    author: '',
    publishDate: ''
  };

  editingBook = {
  id: 0,
  title: '',
  author: '',
  publishDate: ''
  };

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

  createBook() {

    this.bookService.addBook(this.newBook).subscribe({

      next: () => {

        this.newBook = {
          title: '',
          author: '',
          publishDate: ''
        };

        this.loadBooks();

      },

      error: () => {
        alert("Could not create book.");
      }

    });

  }

  editBook(book: any) {

    this.editingBook = {
      id: book.id,
      title: book.title,
      author: book.author,
      publishDate: book.publishDate.substring(0, 10)
    };

    const modal = new bootstrap.Modal(
      document.getElementById('editBookModal')!
    );

    modal.show();

  }

  saveChanges() {

    this.bookService.updateBook(this.editingBook).subscribe({

      next: () => {

        this.loadBooks();

        const modalElement = document.getElementById('editBookModal');

        const modal = bootstrap.Modal.getInstance(modalElement!);

        modal?.hide();

      },

      error: () => {
        alert("Could not update book.");
      }

    });

  }

  deleteBook(id: number) {

    if (!confirm("Delete this book?"))
      return;

    this.bookService.deleteBook(id).subscribe({

      next: () => {
        this.loadBooks();
      },

      error: () => {
        alert("Could not delete book.");
      }

    });

  }

}
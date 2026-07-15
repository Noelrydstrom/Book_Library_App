import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';

import { QuoteService } from '../../services/quotes.service';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css'
})
export class QuotesComponent implements OnInit {

  quotes: any[] = [];

  newQuote = {
    text: '',
    author: ''
  };

  editingQuote = {
    id: 0,
    text: '',
    author: ''
  };

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes() {

    this.quoteService.getQuotes().subscribe({

      next: (response) => {
        this.quotes = response;
      },

      error: () => {
        alert("Could not load quotes.");
      }

    });

  }

  createQuote() {

    this.quoteService.addQuote(this.newQuote).subscribe({

      next: () => {

        this.newQuote = {
          text: '',
          author: ''
        };

        this.loadQuotes();

      },

      error: () => {
        alert("Could not create quote.");
      }

    });

  }

  editQuote(quote: any) {

    this.editingQuote = {
      id: quote.id,
      text: quote.text,
      author: quote.author
    };

    const modal = new bootstrap.Modal(
      document.getElementById('editQuoteModal')!
    );

    modal.show();

  }

  saveChanges() {

    this.quoteService.updateQuote(this.editingQuote).subscribe({

      next: () => {

        this.loadQuotes();

        const modalElement = document.getElementById('editQuoteModal');

        const modal = bootstrap.Modal.getInstance(modalElement!);

        modal?.hide();

      },

      error: () => {
        alert("Could not update quote.");
      }

    });

  }

  deleteQuote(id: number) {

    if (!confirm("Delete this quote?"))
      return;

    this.quoteService.deleteQuote(id).subscribe({

      next: () => {
        this.loadQuotes();
      },

      error: () => {
        alert("Could not delete quote.");
      }

    });

  }

}
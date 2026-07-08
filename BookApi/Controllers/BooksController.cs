using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookApi.Data;
using BookApi.Models;
using Microsoft.AspNetCore.Authorization;
using BookApi.DTOs.Books;

namespace BookApi.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _context;

    public BooksController(AppDbContext context)
    {
        _context = context;
    }


    // GET ALL
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    {
        return await _context.Books.ToListAsync();
    }


    // GET ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        var book = await _context.Books.FindAsync(id);

        if (book == null)
        {
            return NotFound();
        }

        return book;
    }


    // POST
    [HttpPost]
    public async Task<ActionResult<Book>> CreateBook(CreateBookDto request)
    {
        var book = new Book
        {
            Title = request.Title,
            Author = request.Author,
            PublishDate = request.PublishDate
        };

        _context.Books.Add(book);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetBook),
            new { id = book.Id },
            book
        );
    }


    // PUT
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, UpdateBookDto request)
    {
        var book = await _context.Books.FindAsync(id);

        if (book == null)
        {
            return NotFound();
        }

        book.Title = request.Title;
        book.Author = request.Author;
        book.PublishDate = request.PublishDate;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Book updated successfully"
        });
    }


    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);

        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Book deleted successfully"
        });
    }
}
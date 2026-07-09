using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookApi.Data;
using BookApi.Models;

namespace BookApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class QuotesController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuotesController(AppDbContext context)
    {
        _context = context;
    }

    // GET ALL
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Quote>>> GetQuotes()
    {
        return await _context.Quotes.ToListAsync();
    }

    // GET BY ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Quote>> GetQuote(int id)
    {
        var quote = await _context.Quotes.FindAsync(id);

        if (quote == null)
        {
            return NotFound();
        }

        return quote;
    }

    // POST
    [HttpPost]
    public async Task<ActionResult<Quote>> CreateQuote(Quote quote)
    {
        _context.Quotes.Add(quote);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetQuote),
            new { id = quote.Id },
            quote);
    }

    // PUT
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuote(int id, Quote quote)
    {
        if (id != quote.Id)
        {
            return BadRequest();
        }

        _context.Entry(quote).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuote(int id)
    {
        var quote = await _context.Quotes.FindAsync(id);

        if (quote == null)
        {
            return NotFound();
        }

        _context.Quotes.Remove(quote);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
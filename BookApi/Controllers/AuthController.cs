using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookApi.Data;
using BookApi.Models;
using BookApi.DTOs;
using System.Security.Cryptography;
using System.Text;

namespace BookApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto request)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(x => x.Username == request.Username);

        if (existingUser != null)
        {
            return BadRequest("Username already exists");
        }


        using var hmac = new HMACSHA512();

        var user = new User
        {
            Username = request.Username,
            PasswordHash = Convert.ToBase64String(
                hmac.ComputeHash(
                    Encoding.UTF8.GetBytes(request.Password)
                )
            )
        };


        _context.Users.Add(user);

        await _context.SaveChangesAsync();


        return Ok("User created");
    }
}
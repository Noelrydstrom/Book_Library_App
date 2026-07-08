using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookApi.Data;
using BookApi.Models;
using BookApi.DTOs;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BookApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
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
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password)),
            PasswordSalt = hmac.Key
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return Ok("User created");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Username == request.Username);

        if (user == null)
        {
            return Unauthorized("Invalid username or password");
        }

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(
            Encoding.UTF8.GetBytes(request.Password)
        );

        if (!computedHash.SequenceEqual(user.PasswordHash))
        {
            return Unauthorized("Invalid username or password");
        }

        var token = CreateToken(user);

        return Ok(new
        {
            token = token
        });
    }
    private string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
        new Claim(ClaimTypes.Name, user.Username)
         };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"], claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
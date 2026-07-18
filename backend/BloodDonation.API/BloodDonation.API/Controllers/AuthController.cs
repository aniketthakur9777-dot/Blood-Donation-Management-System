using BloodDonation.API.Data;
using BloodDonation.API.DTOs;
using BloodDonation.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BloodDonation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ==========================
        // Register API
        // ==========================
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            var emailExists = await _context.Users.AnyAsync(x => x.Email == model.Email);

            if (emailExists)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Email already exists."
                });
            }

            var role = await _context.Roles.FindAsync(model.RoleId);

            if (role == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid RoleId."
                });
            }

            var user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                PasswordHash = model.Password,
                PhoneNumber = model.PhoneNumber,
                RoleId = model.RoleId,
                IsActive = true,
                CreatedDate = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "User Registered Successfully",
                userId = user.UserId,
                fullName = user.FullName,
                email = user.Email
            });
        }

        // ==========================
        // Login API
        // ==========================
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x =>
                x.Email == model.Email &&
                x.PasswordHash == model.Password);

            if (user == null)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid Email or Password"
                });
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("UserId", user.UserId.ToString()),
                new Claim("RoleId", user.RoleId.ToString()),
                new Claim(ClaimTypes.Name, user.FullName)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(
                    Convert.ToDouble(_configuration["Jwt:DurationInMinutes"])),
                signingCredentials: credentials);

            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                success = true,
                message = "Login Successful",
                token = jwtToken,
                userId = user.UserId,
                fullName = user.FullName,
                roleId = user.RoleId
            });
        }
    }
}
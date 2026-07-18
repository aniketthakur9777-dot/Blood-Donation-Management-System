using BloodDonation.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BloodDonation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonationHistoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DonationHistoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDonationHistory()
        {
            var history = await _context.DonationHistories.ToListAsync();
            return Ok(history);
        }
    }
}
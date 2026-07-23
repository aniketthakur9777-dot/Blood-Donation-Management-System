using BloodDonation.API.Data;
using BloodDonation.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BloodDonation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Notifications
        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] int? userId)
        {
            var query = _context.Notifications.AsQueryable();
            if (userId.HasValue)
            {
                query = query.Where(n => n.UserId == userId.Value);
            }

            var notifications = await query.OrderByDescending(n => n.CreatedDate).ToListAsync();
            return Ok(notifications);
        }

        // PUT: api/Notifications/5/read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound(new { success = false, message = "Notification not found" });

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Notification marked as read" });
        }
    }
}
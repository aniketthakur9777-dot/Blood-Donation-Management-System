using BloodDonation.API.Data;
using BloodDonation.API.DTOs;
using BloodDonation.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BloodDonation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BloodInventoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BloodInventoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/BloodInventory
        [HttpGet]
        public async Task<IActionResult> GetBloodInventory()
        {
            var inventory = await _context.BloodInventories.ToListAsync();
            return Ok(inventory);
        }

        // GET: api/BloodInventory/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInventoryById(int id)
        {
            var item = await _context.BloodInventories.FindAsync(id);
            if (item == null) return NotFound(new { success = false, message = "Inventory item not found" });
            return Ok(item);
        }

        // PUT: api/BloodInventory/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInventory(int id, UpdateInventoryDto dto)
        {
            var item = await _context.BloodInventories.FindAsync(id);
            if (item == null)
            {
                return NotFound(new { success = false, message = "Inventory item not found" });
            }

            item.BloodGroup = dto.BloodGroup;
            item.UnitsAvailable = dto.UnitsAvailable;
            item.LastUpdated = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Blood Inventory updated successfully", data = item });
        }

        // POST: api/BloodInventory
        [HttpPost]
        public async Task<IActionResult> AddOrUpdateInventory(UpdateInventoryDto dto)
        {
            var existing = await _context.BloodInventories.FirstOrDefaultAsync(b => b.BloodGroup == dto.BloodGroup);
            if (existing != null)
            {
                existing.UnitsAvailable += dto.UnitsAvailable;
                existing.LastUpdated = DateTime.Now;
            }
            else
            {
                var newItem = new BloodInventory
                {
                    BloodGroup = dto.BloodGroup,
                    UnitsAvailable = dto.UnitsAvailable,
                    LastUpdated = DateTime.Now
                };
                _context.BloodInventories.Add(newItem);
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Inventory updated successfully" });
        }
    }
}
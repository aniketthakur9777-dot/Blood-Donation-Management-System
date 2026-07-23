using BloodDonation.API.Data;
using BloodDonation.API.DTOs;
using BloodDonation.API.Models;
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

        // GET: api/DonationHistory
        [HttpGet]
        public async Task<IActionResult> GetDonationHistory()
        {
            var history = await _context.DonationHistories
                .Include(dh => dh.Donor)
                .ThenInclude(d => d.User)
                .Select(dh => new
                {
                    dh.DonationId,
                    dh.DonorId,
                    DonorName = dh.Donor.User.FullName,
                    dh.Donor.BloodGroup,
                    dh.DonationDate,
                    dh.UnitsDonated,
                    dh.Remarks
                })
                .OrderByDescending(dh => dh.DonationDate)
                .ToListAsync();

            return Ok(history);
        }

        // POST: api/DonationHistory
        [HttpPost]
        public async Task<IActionResult> RecordDonation(CreateDonationHistoryDto dto)
        {
            var donor = await _context.Donors.FindAsync(dto.DonorId);
            if (donor == null)
            {
                return NotFound(new { success = false, message = "Donor not found" });
            }

            var donation = new DonationHistory
            {
                DonorId = dto.DonorId,
                DonationDate = dto.DonationDate,
                UnitsDonated = dto.UnitsDonated,
                Remarks = dto.Remarks
            };

            _context.DonationHistories.Add(donation);

            // Update donor last donation date
            donor.LastDonationDate = dto.DonationDate;

            // Increment Blood Inventory for donor's blood group
            var inventory = await _context.BloodInventories
                .FirstOrDefaultAsync(b => b.BloodGroup == donor.BloodGroup);

            if (inventory != null)
            {
                inventory.UnitsAvailable += dto.UnitsDonated;
                inventory.LastUpdated = DateTime.Now;
            }
            else
            {
                _context.BloodInventories.Add(new BloodInventory
                {
                    BloodGroup = donor.BloodGroup,
                    UnitsAvailable = dto.UnitsDonated,
                    LastUpdated = DateTime.Now
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Donation recorded successfully", donationId = donation.DonationId });
        }
    }
}
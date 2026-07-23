using BloodDonation.API.Data;
using BloodDonation.API.DTOs;
using BloodDonation.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BloodDonation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BloodRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BloodRequestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/BloodRequests
        [HttpGet]
        public async Task<IActionResult> GetBloodRequests()
        {
            var requests = await _context.BloodRequests.OrderByDescending(r => r.RequestedDate).ToListAsync();
            return Ok(requests);
        }

        // GET: api/BloodRequests/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBloodRequest(int id)
        {
            var request = await _context.BloodRequests.FindAsync(id);
            if (request == null) return NotFound(new { success = false, message = "Request not found" });
            return Ok(request);
        }

        // POST: api/BloodRequests
        [HttpPost]
        public async Task<IActionResult> CreateBloodRequest(CreateBloodRequestDto dto)
        {
            var newRequest = new BloodRequest
            {
                PatientName = dto.PatientName,
                BloodGroup = dto.BloodGroup,
                UnitsRequired = dto.UnitsRequired,
                HospitalName = dto.HospitalName,
                ContactNumber = dto.ContactNumber,
                Status = "Pending",
                RequestedDate = DateTime.Now
            };

            _context.BloodRequests.Add(newRequest);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Blood Request created successfully", requestId = newRequest.RequestId });
        }

        // PUT: api/BloodRequests/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateRequestStatus(int id, UpdateBloodRequestStatusDto dto)
        {
            var request = await _context.BloodRequests.FindAsync(id);
            if (request == null) return NotFound(new { success = false, message = "Request not found" });

            request.Status = dto.Status;
            
            // If status is fulfilled, deduct from blood inventory automatically if available!
            if (dto.Status == "Fulfilled")
            {
                var inventory = await _context.BloodInventories.FirstOrDefaultAsync(b => b.BloodGroup == request.BloodGroup);
                if (inventory != null && inventory.UnitsAvailable >= request.UnitsRequired)
                {
                    inventory.UnitsAvailable -= request.UnitsRequired;
                    inventory.LastUpdated = DateTime.Now;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = $"Request status updated to {dto.Status}" });
        }

        // DELETE: api/BloodRequests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBloodRequest(int id)
        {
            var request = await _context.BloodRequests.FindAsync(id);
            if (request == null) return NotFound(new { success = false, message = "Request not found" });

            _context.BloodRequests.Remove(request);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Blood Request deleted successfully" });
        }
    }
}
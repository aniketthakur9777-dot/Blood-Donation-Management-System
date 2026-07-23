using BloodDonation.API.Data;
using BloodDonation.API.DTOs;
using BloodDonation.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BloodDonation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DonorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Donors
        [HttpGet]
        public async Task<IActionResult> GetDonors()
        {
            var donors = await _context.Donors
                .Include(d => d.User)
                .Select(d => new DonorListDto
                {
                    DonorId = d.DonorId,
                    FullName = d.User.FullName,
                    Email = d.User.Email,
                    PhoneNumber = d.User.PhoneNumber ?? "",
                    BloodGroup = d.BloodGroup,
                    Gender = d.Gender,
                    Weight = d.Weight,
                    IsEligible = d.IsEligible
                })
                .ToListAsync();

            return Ok(donors);
        }

        // GET: api/Donors/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDonor(int id)
        {
            var donor = await _context.Donors.FindAsync(id);

            if (donor == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Donor not found"
                });
            }

            return Ok(donor);
        }

        // POST: api/Donors
        [HttpPost]
        public async Task<IActionResult> AddDonor(AddDonorDto model)
        {
            var donor = new Donor
            {
                UserId = model.UserId,
                BloodGroup = model.BloodGroup,
                Gender = model.Gender,
                DateOfBirth = model.DateOfBirth,
                Weight = model.Weight,
                Address = model.Address,
                LastDonationDate = model.LastDonationDate,
                IsEligible = model.IsEligible
            };

            _context.Donors.Add(donor);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Donor Added Successfully"
            });
        }

        // PUT: api/Donors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDonor(int id, AddDonorDto model)
        {
            var donor = await _context.Donors.FindAsync(id);

            if (donor == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Donor not found"
                });
            }

            donor.UserId = model.UserId;
            donor.BloodGroup = model.BloodGroup;
            donor.Gender = model.Gender;
            donor.DateOfBirth = model.DateOfBirth;
            donor.Weight = model.Weight;
            donor.Address = model.Address;
            donor.LastDonationDate = model.LastDonationDate;
            donor.IsEligible = model.IsEligible;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Donor Updated Successfully"
            });
        }

        // DELETE: api/Donors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDonor(int id)
        {
            var donor = await _context.Donors.FindAsync(id);

            if (donor == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Donor not found"
                });
            }

            _context.Donors.Remove(donor);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Donor Deleted Successfully"
            });
        }
    }
}



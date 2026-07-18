namespace BloodDonation.API.DTOs
{
    public class AddDonorDto
    {
        public int UserId { get; set; }

        public string BloodGroup { get; set; } = string.Empty;

        public string Gender { get; set; } = string.Empty;

        public DateOnly DateOfBirth { get; set; }

        public decimal? Weight { get; set; }

        public string? Address { get; set; }

        public DateOnly? LastDonationDate { get; set; }

        public bool? IsEligible { get; set; }
    }
}
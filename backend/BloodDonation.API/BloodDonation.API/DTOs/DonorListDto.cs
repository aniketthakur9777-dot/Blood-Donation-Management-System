namespace BloodDonation.API.DTOs
{
    public class DonorListDto
    {
        public int DonorId { get; set; }

        public string FullName { get; set; } = "";

        public string Email { get; set; } = "";

        public string PhoneNumber { get; set; } = "";

        public string BloodGroup { get; set; } = "";

        public string Gender { get; set; } = "";

        public decimal? Weight { get; set; }

        public bool? IsEligible { get; set; }
    }
}
namespace BloodDonation.API.DTOs
{
    public class CreateDonationHistoryDto
    {
        public int DonorId { get; set; }
        public DateOnly DonationDate { get; set; }
        public int UnitsDonated { get; set; }
        public string? Remarks { get; set; }
    }
}

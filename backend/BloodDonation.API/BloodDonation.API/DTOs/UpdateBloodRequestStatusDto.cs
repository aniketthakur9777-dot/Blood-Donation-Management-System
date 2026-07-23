namespace BloodDonation.API.DTOs
{
    public class UpdateBloodRequestStatusDto
    {
        public string Status { get; set; } = string.Empty; // Pending, Approved, Fulfilled, Rejected
    }
}

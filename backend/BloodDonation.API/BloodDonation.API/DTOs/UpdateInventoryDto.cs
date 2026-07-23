namespace BloodDonation.API.DTOs
{
    public class UpdateInventoryDto
    {
        public string BloodGroup { get; set; } = string.Empty;
        public int UnitsAvailable { get; set; }
    }
}

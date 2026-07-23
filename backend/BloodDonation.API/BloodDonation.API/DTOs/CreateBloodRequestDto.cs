namespace BloodDonation.API.DTOs
{
    public class CreateBloodRequestDto
    {
        public string PatientName { get; set; } = string.Empty;
        public string BloodGroup { get; set; } = string.Empty;
        public int UnitsRequired { get; set; }
        public string HospitalName { get; set; } = string.Empty;
        public string? ContactNumber { get; set; }
    }
}

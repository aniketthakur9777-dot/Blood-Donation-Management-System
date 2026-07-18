using System;
using System.Collections.Generic;

namespace BloodDonation.API.Models;

public partial class Donor
{
    public int DonorId { get; set; }

    public int UserId { get; set; }

    public string BloodGroup { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public decimal? Weight { get; set; }

    public string? Address { get; set; }

    public DateOnly? LastDonationDate { get; set; }

    public bool? IsEligible { get; set; }

    public virtual ICollection<DonationHistory> DonationHistories { get; set; } = new List<DonationHistory>();

    public virtual User User { get; set; } = null!;
}

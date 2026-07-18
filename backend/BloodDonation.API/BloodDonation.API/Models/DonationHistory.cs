using System;
using System.Collections.Generic;

namespace BloodDonation.API.Models;

public partial class DonationHistory
{
    public int DonationId { get; set; }

    public int DonorId { get; set; }

    public DateOnly DonationDate { get; set; }

    public int UnitsDonated { get; set; }

    public string? Remarks { get; set; }

    public virtual Donor Donor { get; set; } = null!;
}

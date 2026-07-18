using System;
using System.Collections.Generic;

namespace BloodDonation.API.Models;

public partial class BloodRequest
{
    public int RequestId { get; set; }

    public string PatientName { get; set; } = null!;

    public string BloodGroup { get; set; } = null!;

    public int UnitsRequired { get; set; }

    public string HospitalName { get; set; } = null!;

    public string? ContactNumber { get; set; }

    public string? Status { get; set; }

    public DateTime? RequestedDate { get; set; }
}

using System;
using System.Collections.Generic;

namespace BloodDonation.API.Models;

public partial class BloodInventory
{
    public int InventoryId { get; set; }

    public string BloodGroup { get; set; } = null!;

    public int UnitsAvailable { get; set; }

    public DateTime? LastUpdated { get; set; }
}

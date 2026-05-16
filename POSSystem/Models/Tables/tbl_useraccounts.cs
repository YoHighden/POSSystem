using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TricycleSystem.Models.Tables
{
    public class tbl_useraccounts_model
    {
        public int user_id { get; set; }
        public string full_name { get; set; }
        public string status { get; set; }
        public float total_price { get; set; }
        public float monthly_rate { get; set; }
        public float balance { get; set; }
        public DateTime due_date { get; set; }
    }
}   
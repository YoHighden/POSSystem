using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TricycleSystem.Models.Tables
{
    public class tbl_user_model
    {
        public int user_id { get; set; }
        public string full_name { get; set; }
        public int age { get; set; }
        public string email { get; set; }
        public string address { get; set; }
        public string user_name { get; set; }
        public string password { get; set; }
    }
}
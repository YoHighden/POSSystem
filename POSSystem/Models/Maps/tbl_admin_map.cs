using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;
using TricycleSystem.Models.Tables;

namespace TricycleSystem.Models.Maps
{
    public class tbl_admin_map : EntityTypeConfiguration<tbl_admin_model>
    {
        public tbl_admin_map()
        {
            HasKey(i => i.admin_id);
            ToTable("tbl_admin"); 
        }
    }
}
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;
using TricycleSystem.Models.Tables;

namespace TricycleSystem.Models.Maps
{
    public class tbl_user_map : EntityTypeConfiguration<tbl_user_model>
    {
        public tbl_user_map()
        {
            HasKey(i => i.user_id);
            ToTable("tbl_user");
        }
    }
}
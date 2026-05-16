using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using TricycleSystem.Models.Maps;
using TricycleSystem.Models.Tables;

namespace TricycleSystem.Models.Context
{
    [DbConfigurationType(typeof(MySqlConfiguration))]
    public class TricycleContext : DbContext
    {
        static TricycleContext()
        {
            Database.SetInitializer<TricycleContext>(null);
        }

        public TricycleContext() : base("Name=tricyclemanagementsystemdb") { }

        public virtual DbSet<tbl_admin_model> tbl_admin { get; set; }
        public virtual DbSet<tbl_user_model> tbl_user { get; set; }
        public virtual DbSet<tbl_useraccounts_model> tbl_useraccounts { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Configurations.Add(new tbl_admin_map());
            modelBuilder.Configurations.Add(new tbl_user_map());
            modelBuilder.Configurations.Add(new tbl_useraccounts_map());
        }
    }


    public class MySqlConfiguration : DbConfiguration
    {
        public MySqlConfiguration()
        {
            SetProviderServices("MySql.Data.MySqlClient", new MySql.Data.MySqlClient.MySqlProviderServices());
            
            SetManifestTokenResolver(new MySqlManifestTokenResolver());
        }
    }

    public class MySqlManifestTokenResolver : IManifestTokenResolver
    {
        public string ResolveManifestToken(DbConnection connection)
        {
            return "5.7";
        }
    }
}
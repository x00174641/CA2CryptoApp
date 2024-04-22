﻿using System;
using System.Collections.Generic;
using CryptoApi.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace API.Models;
public partial class DefaultdbContext : DbContext
{
    public DbSet<User> Users { get; set; }

    // Other code...
}
public partial class DefaultdbContext : DbContext
{
    public DefaultdbContext()
    {
        
    }

    public DefaultdbContext(DbContextOptions<DefaultdbContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    #warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=db-mysql-lon1-09773-do-user-16195469-0.c.db.ondigitalocean.com;port=25060;database=defaultdb;uid=doadmin;pwd=AVNS_gH_0fY3uABDefT4jW_6;sslmode=Required", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.30-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

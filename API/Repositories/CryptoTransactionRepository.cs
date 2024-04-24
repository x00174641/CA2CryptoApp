using API.Models;
using CryptoApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CryptoApi.Repositories
{
    public class CryptoTransactionRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public CryptoTransactionRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void AddCryptoTransaction(CryptoTransaction transaction)
        {
            _dbContext.CryptoTransactions.Add(transaction);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
        public IEnumerable<CryptoTransaction> GetTransactionsByUserId(string userId)
        {
            return _dbContext.CryptoTransactions.Where(t => t.UserId == userId).ToList();
        }
    }
}
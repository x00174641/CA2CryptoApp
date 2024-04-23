using API.Models;
using CryptoApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace CryptoApi.Repositories
{
    public class CryptoPortfolioRepository
    {
        private readonly ApplicationDbContext _dbContext;
        
        public CryptoPortfolioRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        public IEnumerable<CryptoPortfolio> GetAllCryptoPortfolios()
        {
            return _dbContext.CryptoPortfolio.ToList();
        }
        
        public IEnumerable<CryptoPortfolio> GetCryptoPortfoliosByUserId(string Id)
        {
            return _dbContext.CryptoPortfolio.Where(p => p.Id == Id).ToList();
        }
        
        
    }
}
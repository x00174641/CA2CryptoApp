using System.Linq;
using API.Models;
using CryptoApi.Models;

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

        public IEnumerable<CryptoPortfolio> GetCryptoPortfoliosByUserId(string userId)
        {
            try
            {
                return _dbContext.CryptoPortfolio.Where(p => p.Id == userId).ToList();
            }
            catch (Exception ex)
            {
                // Log the exception or return a generic error message
                Console.WriteLine(ex);
                throw; // rethrow the exception to be handled higher up the call stack
            }
        }

        public CryptoPortfolio GetCryptoPortfolioByUserIdAndSymbol(string userId, string cryptoSymbol)
        {
            return _dbContext.CryptoPortfolio.FirstOrDefault(p => p.Id == userId && p.CryptoSymbol == cryptoSymbol);
        }

        public void AddCryptoPortfolio(CryptoPortfolio cryptoPortfolio)
        {
            _dbContext.CryptoPortfolio.Add(cryptoPortfolio);
        }

        public void UpdateCryptoPortfolio(CryptoPortfolio cryptoPortfolio)
        {
            _dbContext.CryptoPortfolio.Update(cryptoPortfolio);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}
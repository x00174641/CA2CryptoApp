using CryptoApi.Models;
using API.Models;

namespace CryptoApi.Repositories;

public class CryptoPorfolioRepository
{
    private readonly ApplicationDbContext _dbContext;
    
    public CryptoPorfolioRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public IEnumerable<CryptoPortfolio> GetAllCryptoPortfolios()
    {
        return _dbContext.CryptoPortfolio.ToList();
    }
}
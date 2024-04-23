using Newtonsoft.Json;

namespace CryptoApi.Models
{
    public class CryptoPortfolio 
    {
        public int PortfolioID { get; set; }
        public int UserID { get; set; } // Foreign key to relate portfolio to user
        public string CryptoSymbol { get; set; } 
        public int Amount { get; set; }
    }
}
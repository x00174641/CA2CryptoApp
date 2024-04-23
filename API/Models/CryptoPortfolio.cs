using System.ComponentModel.DataAnnotations;

namespace CryptoApi.Models
{
    public class CryptoPortfolio 
    {   
        [Key]
        public int PortfolioID { get; set; }
        public string Id { get; set; } // Should match the type in AspNetUsers table
        public string CryptoSymbol { get; set; } 
        public decimal Amount { get; set; } // Should match the type in your database schema
    }
}
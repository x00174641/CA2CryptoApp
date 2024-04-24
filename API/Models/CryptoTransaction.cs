using System;
using System.ComponentModel.DataAnnotations;

namespace CryptoApi.Models
{
    public class CryptoTransaction
    {
        [Key]
        public int TransactionID { get; set; }
        public string UserId { get; set; }
        public string CryptoSymbol { get; set; }
        public string TransactionType { get; set; }
        public decimal Amount { get; set; }
        public decimal Price { get; set; }
        public DateTime TransactionDateTime { get; set; }
    }
}
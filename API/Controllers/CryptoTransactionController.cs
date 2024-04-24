using CryptoApi.Models;
using CryptoApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace CryptoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CryptoTransactionController : ControllerBase
    {
        private readonly CryptoTransactionRepository _cryptoTransactionRepository;

        public CryptoTransactionController(CryptoTransactionRepository cryptoTransactionRepository)
        {
            _cryptoTransactionRepository = cryptoTransactionRepository;
        }

        [HttpGet("getTransactionsByUserId/{userId}")]
        public ActionResult<IEnumerable<CryptoTransaction>> GetTransactionsByUserId(string userId)
        {
            try
            {
                var transactions = _cryptoTransactionRepository.GetTransactionsByUserId(userId);

                if (transactions == null || !transactions.Any())
                {
                    return NotFound();
                }

                return Ok(transactions);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while processing your request.");
            }
        }
        
        [HttpGet("getCryptoPrice/{cryptoSymbol}")]
        public async Task<decimal> GetCryptoPrice(string cryptoSymbol)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("X-RapidAPI-Key", "cfa2caddadmshe13d9ac6b989363p10da2ejsn16d1e4a1d93f");
                client.DefaultRequestHeaders.Add("X-RapidAPI-Host", "real-time-quotes1.p.rapidapi.com");

                var requestUri = $"https://real-time-quotes1.p.rapidapi.com/api/v1/realtime/crypto?source={cryptoSymbol}&target=USD";
                using (var response = await client.GetAsync(requestUri))
                {
                    response.EnsureSuccessStatusCode();
                    var body = await response.Content.ReadAsStringAsync();
            
                    // Console.WriteLine the JSON response
                    Console.WriteLine(body);

                    // Parse the JSON response
                    var cryptoDataArray = JArray.Parse(body);
                    var cryptoData = cryptoDataArray.FirstOrDefault();

                    if (cryptoData != null)
                    {
                        var price = cryptoData["price"].Value<decimal>();
                        return price;
                    }
                    else
                    {
                        // Handle case where no data is returned
                        throw new Exception("No data returned from API.");
                    }
                }
            }
        }

    }
    
    
}
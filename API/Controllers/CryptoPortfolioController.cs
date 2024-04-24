using CryptoApi.Models;
using CryptoApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CryptoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CryptoPortfolioController : ControllerBase
    {
        private readonly CryptoPortfolioRepository _cryptoPortfolioRepository;
        private readonly CryptoTransactionRepository _cryptoTransactionRepository;

        public CryptoPortfolioController(CryptoPortfolioRepository cryptoPortfolioRepository, CryptoTransactionRepository cryptoTransactionRepository)
        {
            _cryptoPortfolioRepository = cryptoPortfolioRepository;
            _cryptoTransactionRepository = cryptoTransactionRepository;
        }

        [HttpGet("getAllPortfolios")]
        public ActionResult<IEnumerable<CryptoPortfolio>> GetPortfolios()
        {
            var portfolios = _cryptoPortfolioRepository.GetAllCryptoPortfolios();
            return Ok(portfolios);
        }

        [HttpGet("getUserPortfolio/{userid}")]
        public ActionResult<IEnumerable<CryptoPortfolio>> GetCryptoPortfoliosByUserId(string userid)
        {
            try
            {
                var portfolio = _cryptoPortfolioRepository.GetCryptoPortfoliosByUserId(userid);

                if (portfolio == null || !portfolio.Any())
                {
                    return NotFound();
                }

                return Ok(portfolio);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while processing your request.");
            }
        }

        [HttpGet("getTotalPortfolioValue/{userid}")]
        public async Task<ActionResult<decimal>> getTotalPortfolioValue(string userid)
        {
            try
            {
                var portfolios = _cryptoPortfolioRepository.GetCryptoPortfoliosByUserId(userid);

                if (portfolios == null || !portfolios.Any())
                {
                    return NotFound();
                }

                decimal totalValue = 0m;

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("X-RapidAPI-Key", "cfa2caddadmshe13d9ac6b989363p10da2ejsn16d1e4a1d93f");
                    client.DefaultRequestHeaders.Add("X-RapidAPI-Host", "real-time-quotes1.p.rapidapi.com");

                    foreach (var portfolio in portfolios)
                    {
                        var requestUri = $"https://real-time-quotes1.p.rapidapi.com/api/v1/realtime/crypto?source={portfolio.CryptoSymbol}&target=USD";
                        using (var response = await client.GetAsync(requestUri))
                        {
                            response.EnsureSuccessStatusCode();
                            var body = await response.Content.ReadAsStringAsync();
                            var cryptoData = JsonConvert.DeserializeObject<JArray>(body);
                            var price = cryptoData[0]["price"].Value<decimal>();
                            totalValue += portfolio.Amount * price;
                        }
                    }
                }

                return Ok(totalValue);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while calculating the total portfolio value.");
            }
        }

      [HttpPost("addCryptoToPortfolio/{userId}")]
    public async Task<ActionResult<CryptoPortfolio>> AddCryptoToPortfolio(string userId, CryptoPortfolio cryptoPortfolio)
    {
        try
        {
            if (cryptoPortfolio == null)
            {
                return BadRequest("Crypto portfolio data is null.");
            }

            cryptoPortfolio.Id = userId;

            var existingPortfolio = _cryptoPortfolioRepository.GetCryptoPortfolioByUserIdAndSymbol(userId, cryptoPortfolio.CryptoSymbol);

            if (existingPortfolio != null)
            {
                existingPortfolio.Amount += cryptoPortfolio.Amount;
                _cryptoPortfolioRepository.UpdateCryptoPortfolio(existingPortfolio);
            }
            else
            {
                _cryptoPortfolioRepository.AddCryptoPortfolio(cryptoPortfolio);
            }

            // Fetch the current price of the cryptocurrency
            var price = await GetCryptoPrice(cryptoPortfolio.CryptoSymbol);

            // Log the transaction
            var transaction = new CryptoTransaction
            {
                UserId = userId,
                CryptoSymbol = cryptoPortfolio.CryptoSymbol,
                TransactionType = "Buy",
                Amount = cryptoPortfolio.Amount,
                Price = price,
                TransactionDateTime = DateTime.Now
            };
            _cryptoTransactionRepository.AddCryptoTransaction(transaction);

            await _cryptoPortfolioRepository.SaveChangesAsync();
            await _cryptoTransactionRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCryptoPortfoliosByUserId), new { userId = cryptoPortfolio.Id }, cryptoPortfolio);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return StatusCode(500, "An error occurred while adding crypto to the portfolio.");
        }
    }

    private async Task<decimal> GetCryptoPrice(string cryptoSymbol)
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
                var cryptoData = JsonConvert.DeserializeObject<JArray>(body);
                var price = cryptoData[0]["price"].Value<decimal>();
                return price;
            }
        }
    }
    }
}

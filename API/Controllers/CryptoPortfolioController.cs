using CryptoApi.Models;
using CryptoApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CryptoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    /*[Authorize]*/
    public class CryptoPortfolioController : ControllerBase
    {
        private readonly CryptoPortfolioRepository _cryptoPortfolioRepository;
        
        public CryptoPortfolioController(CryptoPortfolioRepository cryptoPortfolioRepository)
        {
            _cryptoPortfolioRepository = cryptoPortfolioRepository;
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
                    return NotFound("User doesn't have any crypto holdings.");
                }

                return Ok(portfolio);
            }
            catch (Exception ex)
            {
                // Log the exception or return a generic error message
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

                if (portfolios == null || !portfolios.Any() || portfolios.IsNullOrEmpty())
                {
                    return NotFound("User doesn't have any crypto holdings.");
                }

                decimal totalValue = 0m;

                // HttpClient setup
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("X-RapidAPI-Key", "5f3853b99amsh601f7aab225fb6ep1a2569jsndd2d15834371");
                    client.DefaultRequestHeaders.Add("X-RapidAPI-Host", "real-time-quotes1.p.rapidapi.com");

                    foreach (var portfolio in portfolios)
                    {
                        // API call to get the current value of the crypto
                        var requestUri = $"https://real-time-quotes1.p.rapidapi.com/api/v1/realtime/crypto?source={portfolio.CryptoSymbol}&target=USD";
                        using (var response = await client.GetAsync(requestUri))
                        {
                            response.EnsureSuccessStatusCode();
                            var body = await response.Content.ReadAsStringAsync();
                            var cryptoData = JsonConvert.DeserializeObject<JArray>(body);

                            // Extract the price of the crypto asset
                            var price = cryptoData[0]["price"].Value<decimal>();

                            // Calculate the total value by multiplying the quantity with the current value of the crypto
                            totalValue += portfolio.Amount * price;
                        }
                    }
                }

                // Return the total portfolio value
                return Ok(totalValue);
            }
            catch (Exception ex)
            {
                // Log the exception
                // Return an appropriate error message
                return StatusCode(500, "An error occurred while calculating the total portfolio value.");
            }
        }
        
        [HttpPost("addCryptoToPortfolio/{userId}")]
        public async Task<ActionResult<CryptoPortfolio>> AddCryptoToPortfolio(string userId, CryptoPortfolio cryptoPortfolio)
        {
            try
            {
                // Validate the incoming data
                if (cryptoPortfolio == null)
                {
                    return BadRequest("Crypto portfolio data is null.");
                }

                // Set the user ID
                cryptoPortfolio.Id = userId;

                // Check if the user already has holdings for this cryptocurrency
                var existingPortfolio = _cryptoPortfolioRepository.GetCryptoPortfolioByUserIdAndSymbol(userId, cryptoPortfolio.CryptoSymbol);

                if (existingPortfolio != null)
                {
                    // User already has holdings for this cryptocurrency, update the amount
                    existingPortfolio.Amount += cryptoPortfolio.Amount;
                    _cryptoPortfolioRepository.UpdateCryptoPortfolio(existingPortfolio);
                }
                else
                {
                    // Add the new crypto portfolio to the repository
                    _cryptoPortfolioRepository.AddCryptoPortfolio(cryptoPortfolio);
                }

                await _cryptoPortfolioRepository.SaveChangesAsync();

                // Return the updated or added crypto portfolio
                return CreatedAtAction(nameof(GetCryptoPortfoliosByUserId), new { userId = cryptoPortfolio.Id }, cryptoPortfolio);
            }
            catch (Exception ex)
            {
                // Log the exception
                // Return an appropriate error message
                return StatusCode(500, "An error occurred while adding crypto to the portfolio.");
            }
        }


        
        
    }
}
using CryptoApi.Models;
using CryptoApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace CryptoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
    }
}
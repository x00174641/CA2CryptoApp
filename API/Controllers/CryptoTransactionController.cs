using CryptoApi.Models;
using CryptoApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
    }
}
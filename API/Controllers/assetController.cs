// AssetController.cs

using System;
using System.Threading.Tasks;
using CryptoApi.Models;
using Microsoft.AspNetCore.Mvc;
using CryptoApi.Repositories;

namespace CryptoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssetController : ControllerBase
    {
        private readonly AssetRepository _assetRepository;

        public AssetController(AssetRepository assetRepository)
        {
            _assetRepository = assetRepository;
        }

        [HttpPost("user/{userId}")]
        public async Task<IActionResult> AddUserAsset(int userId, [FromBody] string assetsJSON)
        {
            var result = await _assetRepository.AddUserAsset(userId, assetsJSON);
            if (result)
                return Ok("Asset added successfully");
            else
                return BadRequest("Failed to add asset");
        }

        [HttpGet("user/{userId}")]
        public ActionResult<Asset> GetAssetsByUserId(int userId)
        {
            try
            {
                var asset = _assetRepository.GetAssetsByUserId(userId);

                if (asset == null)
                {
                    return NotFound();
                }

                return Ok(asset);
            }
            catch (Exception ex)
            {
                // Log the exception or return a generic error message
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while processing your request.");

            }
        }
    }
}
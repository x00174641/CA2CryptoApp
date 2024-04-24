// AssetController.cs

using System;
using System.Globalization;
using System.Threading.Tasks;
using CryptoApi.Models;
using Microsoft.AspNetCore.Mvc;
using CryptoApi.Repositories;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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

        [HttpPost("user/assets/{userId}")]
        public async Task<IActionResult> AddUserAsset(int userId, [FromBody] string assetsJSON)
        {
            var result = await _assetRepository.AddUserAsset(userId, assetsJSON);
            if (result)
                return Ok("Asset added successfully");
            else
                return BadRequest("Failed to add asset");
        }

        [HttpGet("user/assetstotal/{userId}")]
        public ActionResult<Dictionary<string, decimal>> GetAssetsByUserId(int userId)
        {
            try
            {
                var assets = _assetRepository.GetAssetsByUserId(userId);

                if (assets == null || !assets.Any())
                {
                    return NotFound();
                }

                // Dictionary to store asset values
                var assetsValues = new Dictionary<string, decimal>();

                foreach (var asset in assets)
                {
                    // Deserialize the JSON string into a JObject
                    var jsonObject = JsonConvert.DeserializeObject<JObject>(asset.assetsJSON);

                    // Extract keys and values from the JObject
                    foreach (var property in jsonObject.Properties())
                    {
                        // Convert value to decimal (assuming the values are numeric)
                        if (decimal.TryParse(property.Value.ToString(), NumberStyles.Float, CultureInfo.InvariantCulture, out decimal value))
                        {
                            // Add or update the asset value in the dictionary
                            if (assetsValues.ContainsKey(property.Name))
                            {
                                assetsValues[property.Name] += value;
                            }
                            else
                            {
                                assetsValues[property.Name] = value;
                            }
                        }
                    }
                }

                return Ok(assetsValues);
            }
            catch (Exception ex)
            {
                // Log the exception or return a generic error message
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while processing your request.");
            }
        }
        
    [HttpGet("user/assetstotalvalue/{userId}")]
    public async Task<ActionResult<decimal>> GetTotalAssetsValueByUserId(int userId)
    {
        try
        {
            var assets = _assetRepository.GetAssetsByUserId(userId);

            if (assets == null || !assets.Any())
            {
                return NotFound();
            }

            // Total value of all assets
            decimal totalValue = 0m;

            // HttpClient setup
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("X-RapidAPI-Key", "cfa2caddadmshe13d9ac6b989363p10da2ejsn16d1e4a1d93f");
                client.DefaultRequestHeaders.Add("X-RapidAPI-Host", "real-time-quotes1.p.rapidapi.com");

                foreach (var asset in assets)
                {
                    // Deserialize the JSON string into a JObject
                    var jsonObject = JsonConvert.DeserializeObject<JObject>(asset.assetsJSON);

                    foreach (var property in jsonObject.Properties())
                    {
                        // Convert value to decimal (assuming the values are numeric)
                        if (decimal.TryParse(property.Value.ToString(), NumberStyles.Float, CultureInfo.InvariantCulture, out decimal quantity))
                        {
                            // API call to get the current value of the crypto
                            var requestUri = $"https://real-time-quotes1.p.rapidapi.com/api/v1/realtime/crypto?source={property.Name}&target=USD";
                            using (var response = await client.GetAsync(requestUri))
                            {
                                response.EnsureSuccessStatusCode();
                                var body = await response.Content.ReadAsStringAsync();
                                var cryptoData = JsonConvert.DeserializeObject<JArray>(body);

                                // Extract the price of the crypto asset
                                var price = cryptoData[0]["price"].Value<decimal>();

                                // Calculate the total value by multiplying the quantity with the current value of the crypto
                                totalValue += quantity * price;
                            }
                        }
                    }
                }
            }

            return Ok(totalValue);
        }
        catch (Exception ex)
        {
            // Log the exception
            Console.WriteLine($"An error occurred: {ex}");

            // Return the exception message in the response
            return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
        }
    }
        
        
    }
}
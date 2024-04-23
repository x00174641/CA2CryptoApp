// AssetRepository.cs

using System;
using System.Threading.Tasks;
using API.Models;
using CryptoApi.Models; 
using Microsoft.EntityFrameworkCore;

namespace CryptoApi.Repositories
{
    public class AssetRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public AssetRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> AddUserAsset(int userId, string assetsJSON)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                    return false;

                var asset = new Asset
                {
                    userID = userId,
                    assetsJSON = assetsJSON
                };

                _dbContext.Assets.Add(asset);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception)
            {
                // Handle exceptions
                return false;
            }
        }

        public List<Asset> GetAssetsByUserId(int userId)
        {
            // Retrieve all assets owned by the specified user
            return _dbContext.Assets.Where(asset => asset.userID == userId).ToList();
        }
        
        public List<Asset> GetTotalAssetsValueByUserId(int userId)
        {
            // Retrieve all assets owned by the specified user
            return _dbContext.Assets.Where(asset => asset.userID == userId).ToList();
        }
        
    }
}
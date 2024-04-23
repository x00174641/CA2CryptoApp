// Asset.cs

using Newtonsoft.Json;

namespace CryptoApi.Models
{
    public class Asset 
    {
        public int assetID { get; set; }
        public int userID { get; set; } // Foreign key to relate asset to user
        [JsonProperty("assetsJSON")] // Specify the JSON property name
        public string assetsJSON { get; set; } // JSON field to store asset data
    }
}
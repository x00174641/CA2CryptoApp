using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace CryptoApi.Models
{
    public class User : IdentityUser<int>
    {
        private int _id;

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id 
        { 
            get => _id; 
            set => _id = value; 
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using CryptoApi.Models;
using CryptoApi.Repositories;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CryptoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public UserController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<User>> GetUsers()
        {
            var users = _userRepository.GetAllUsers();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public ActionResult<User> GetUser(int id)
        {
            try
            {
                var user = _userRepository.GetUserById(id);
        
                if (user == null)
                {
                    return NotFound();
                }
        
                return Ok(user);
            }
            catch (Exception ex)
            {
                // Log the exception or return a generic error message
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while processing your request.");
            }
        }
        
        [HttpGet("HelloWorld")] // Change the route to something unique, e.g., "HelloWorld"
        public string HelloWorld()
        {
            return "Hello World";
        }
        
        [HttpGet("fetchId")]
        [Authorize] // Add [Authorize] attribute to allow only authenticated users to access this endpoint
        public async Task<ActionResult<string>> fetchId()
        {
            try
            {
                // Get the user's ID (primary key)
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Check if user ID is not null
                if (!string.IsNullOrEmpty(userId))
                {
                    // Return the user's ID
                    return $"{userId}";
                }

                // If the user ID is null or empty, return a 404 Not Found response
                return NotFound();
            }
            catch (Exception ex)
            {
                // Log the exception or return a generic error message
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while processing your request.");
            }
        }

        [HttpPost]
        public ActionResult<User> CreateUser(User user)
        {
            _userRepository.AddUser(user);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }
            _userRepository.UpdateUser(user);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _userRepository.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            _userRepository.DeleteUser(user);
            return NoContent();
        }
    }
}
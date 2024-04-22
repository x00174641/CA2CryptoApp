using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using CryptoApi.Models;
using CryptoApi.Repositories;

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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Sabio.Models;
using Sabio.Models.Requests.Users;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Core;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserApiController : BaseApiController
    {
        private IUserService _userService;
        private IAuthenticationService<int> _authService;
        private IEmailService _emailService;
        IOptions<SecurityConfig> _options;

        public UserApiController(IUserService userService
            , IAuthenticationService<int> authService
            , ILogger<UserApiController> logger
            , IOptions<SecurityConfig> options
            , IEmailService emailService) : base(logger)
        {
            _userService = userService;
            _authService = authService;
            _options = options;
            _emailService = emailService;

        }
       
        [HttpPost]
        [AllowAnonymous]
        public ActionResult<ItemResponse<int>> Create(UserAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                string token = Guid.NewGuid().ToString();
                int id = _userService.Add(model);
                _userService.InsertToken(id, 1, token);
                _emailService.SendWelcomeEmail(model.Email, token);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPost("confirm")]
        [AllowAnonymous]
        public ActionResult<SuccessResponse> ConfirmUser(UserConfirmRequest model)
        {
            BaseResponse response = null;
            try
            {
                _userService.ConfirmUser(model);
                response = new SuccessResponse();
                return Ok200(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.Message);
                return StatusCode(500, new ErrorResponse(ex.Message));
            }

        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse>> LogInAsync(UserLoginRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                bool loggedIn = await _userService.LogInAsync(model.Email, model.Password);
                if (loggedIn)
                {
                    response = new SuccessResponse();
                }
                else
                {
                    iCode = 401;
                    response = new ErrorResponse("No record found");
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.Message);
                return StatusCode(401, new ErrorResponse(ex.Message));
            }
            return StatusCode(iCode, response);

        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<IUserAuthData>> GetCurrrent()
        {
            try
            {
                IUserAuthData user = _authService.GetCurrentUser();
                //var extarData= _userService.GetProfile();
                //make a new model that has a property of profile and authdata or modify model
                ItemResponse<IUserAuthData> response = new ItemResponse<IUserAuthData>();
                response.Item = user;
                return Ok200(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.Message);
                return StatusCode(500, new ErrorResponse(ex.Message));

            }

        }

        [HttpGet("logout")]
        public async Task<ActionResult<SuccessResponse>> LogoutAsync()
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                await _authService.LogOutAsync();
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.Message);
                return StatusCode(401, new ErrorResponse(ex.Message));
            }
            return StatusCode(iCode, response);
        }
    }
}
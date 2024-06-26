using System.Security.Claims;
using System.Text;
using API.DTOs;
using API.Services;
using Application.Activities;
using Domain;
using Infrastructure.Email;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenService _tokenService;
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly EmailSender _emailSender;
    public AccountController(UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        TokenService tokenService,
        EmailSender emailSender,
        IConfiguration config)
    {
        _signInManager = signInManager;
        _tokenService = tokenService;
        _userManager = userManager;
        _config = config;
        _emailSender = emailSender;
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri("https://graph.facebook.com")
        };

    }
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

        if (user == null) return Unauthorized("Invalid email");
        if (user.UserName == "bob") user.EmailConfirmed = true;

        if (!user.EmailConfirmed) return Unauthorized("Email not confirmed");
        var results = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        if (results.Succeeded)
        {
            await SetRefreshToken(user);
            return CreatUserObject(user);
        }
        return Unauthorized("Invalid password");
    }
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
        {
            ModelState.AddModelError("username", "Username is already taken");

            return ValidationProblem();
        }
        if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
        {
            ModelState.AddModelError("email", "Email is already taken");
            return ValidationProblem();
        }

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Username
        };
        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded) return BadRequest("Problem registering user account");

        var origin = Request.Headers["origin"];
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
        var message = $"<p>Please click the below link to vetify your email adressL</p> <p> <a href='{verifyUrl}'>Click to verify email</a> </p>";
        await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);
        return Ok("Registration successful - please verify email");
    }

    [AllowAnonymous]
    [HttpPost("verifyEmail")]
    public async Task<ActionResult> VerifyEmail(string token, string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return Unauthorized("Invalid email");
        token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (!result.Succeeded) return BadRequest("Invalid email confirmation token");
        return Ok("Email confirmed - you can now login");
    }

    [AllowAnonymous]
    [HttpGet("resendEmailConfirmation")]
    public async Task<ActionResult> ResendEmailConfirmation(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return Unauthorized("Invalid email");
        if (user.EmailConfirmed) return BadRequest("Email already confirmed");

        var origin = Request.Headers["origin"];
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
        var message = $"<p>Please click the below link to vetify your email adressL</p> <p> <a href='{verifyUrl}'>Click to verify email</a> </p>";
        await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);
        return Ok("Email verification link resent");
    }


    [Authorize]
    private ActionResult<UserDto> CreatUserObject(AppUser user)
    {
        return new UserDto
        {
            DisplayName = user.DisplayName,
            Image = user?.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            Token = _tokenService.CreateToken(user),
            Username = user.UserName
        };
    }

    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
        await SetRefreshToken(user);
        return CreatUserObject(user);
    }

    [Authorize]
    [HttpPost("refreshToken")]
    public async Task<ActionResult<UserDto>> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var user = await _userManager.Users.Include(r => r.RefreshTokens)
        .Include(p => p.Photos)
        .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

        if (user == null) return Unauthorized();
        var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);
        if (oldToken != null && !oldToken.IsActive) return Unauthorized();

        if (oldToken != null) oldToken.Revoked = DateTime.UtcNow;
        return CreatUserObject(user);
    }


    [AllowAnonymous]
    [HttpPost("fbLogin")]
    public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
    {
        var fbVerifyKeys = _config["Facebook:AppId"] + "|" + _config["Facebook:AppSecret"];

        var verifyTokenResponse = await _httpClient.GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");
        if (!verifyTokenResponse.IsSuccessStatusCode) return Unauthorized();
        var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";

        var fbInfo = await _httpClient.GetFromJsonAsync<FacebookDto>(fbUrl);
        var user = await _userManager.Users.Include(p => p.Photos)
        .FirstOrDefaultAsync(x => x.Email == fbInfo.Email);

        if (user != null) return CreatUserObject(user);

        user = new AppUser
        {
            DisplayName = fbInfo.Name,
            Email = fbInfo.Email,
            UserName = fbInfo.Email,
            Photos = new List<Photo>
            {
                new Photo
                {
                    Id = "fb_" + fbInfo.Id,
                    Url = fbInfo.Picture.Data.Url,
                    IsMain = true
                }
            }
        };

        var result = await _userManager.CreateAsync(user);
        if (!result.Succeeded) return BadRequest("Problem creating user account");

        await SetRefreshToken(user);
        return CreatUserObject(user);
    }

    private async Task SetRefreshToken(AppUser user)
    {
        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshTokens.Add(refreshToken);
        await _userManager.UpdateAsync(user);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
    }

}


using Data;
using Data.Providers;
using Models;
using Models.Domain;
using Models.Domain.Users;
using Models.Requests.Users;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Services
{
    public class UserService : IUserService
    {
        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;
        public UserService(IAuthenticationService<int> authSerice, IDataProvider dataProvider)
        {
            _authenticationService = authSerice;
            _dataProvider = dataProvider;
        }
        public async Task<bool> LogInAsync(string email, string password)
        {
            bool isSuccessful = false;

            IUserAuthData response = Get(email, password);

            if (response != null)
            {
                await _authenticationService.LogInAsync(response);
                isSuccessful = true;
            }
            return isSuccessful;
        }
        private IUserAuthData Get(string email, string password)
        {
            string passwordFromDb = "";
            UserBase user = null;

            string procName = "[dbo].[Users_Select_AuthData]";
            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Email", email);
            }, delegate (IDataReader reader, short set)
            {
                user = new UserBase();
                int startingIndex = 0;
                user.Id = reader.GetSafeInt32(startingIndex++);
                user.Name = email;
                List<Role> roles = reader.DeserializeObject<List<Role>>(startingIndex++);
                user.Roles = roles.Select(x => x.Name).ToList();
                passwordFromDb = reader.GetSafeString(startingIndex++);
                user.TenantId = "flow-beta-v0.0.1";
            }
);
            bool isValidCredentials = BCrypt.BCryptHelper.CheckPassword(password, passwordFromDb);

            if (isValidCredentials)
            {
                return user;
            }
            return null;
        }
        public int Add(UserAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[Users_Insert]";
            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    string salt = BCrypt.BCryptHelper.GenerateSalt();
                    string hashedPassword = BCrypt.BCryptHelper.HashPassword(model.Password, salt);
                    col.AddWithValue("@Email", model.Email);
                    col.AddWithValue("@Password", hashedPassword);
                    col.AddWithValue("@NewRefType", model.NewRefType);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    col.Add(idOut);
                }, returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });
            return id;
        }
        public void InsertToken(int userId, int tokenType, string token)
        {
            string procName = "[dbo].[UserTokens_Insert]";
            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                    {
                        col.AddWithValue("@Token", token);
                        col.AddWithValue("@UserId", userId);
                        col.AddWithValue("@TokenType", tokenType);
                    });
        }
        public void ConfirmUser(UserConfirmRequest model)
        {
            string procName = "[dbo].[Users_Confirm]";
            _dataProvider.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Token", model.Token);
                });
        }
        public async Task<bool> LogInTest(string email, string password, int id, string[] roles = null)
        {
            bool isSuccessful = false;
            var testRoles = new[] { "User", "Super", "Content Manager" };

            var allRoles = roles == null ? testRoles : testRoles.Concat(roles);

            IUserAuthData response = new UserBase
            {
                Id = id
                ,
                Name = email
                ,
                Roles = allRoles
                ,
                TenantId = "Test"
            };

            Claim fullName = new Claim("CustomClaim", "LogInTest");
            await _authenticationService.LogInAsync(response, new Claim[] { fullName });
            return isSuccessful;
        }
    }
}
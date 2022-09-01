USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Users_Select_AuthData]    Script Date: 9/1/2022 9:53:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Travis Lindsey
-- Create date: 2022-07-27
-- Description: Selects all associated UserRoles as well as password, based on UserEmail. This is the user data for Auth Cookie.
-- Code Reviewer: Chris Carter

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER   proc [dbo].[Users_Select_AuthData]

			@Email nvarchar(255)

as

/* --- TEST CODE ---

			--- CONFIRMED USER & ACTIVE STATUS ---
			DECLARE @Email nvarchar(255) = '9999999as@dispostable.com'
			EXEC dbo.Users_Select_AuthData @Email

			--- UNCONFIRMED & NOT ACTIVE --- 
			DECLARE @Email nvarchar(255) = 'a1@aol.com'
			EXEC dbo.Users_Select_AuthData @Email


*/ --- END TEST CODE ---

BEGIN

			DECLARE @isConfirmed bit
			SELECT @isConfirmed = (
				SELECT u.IsConfirmed
				FROM dbo.Users as u
				WHERE @Email = u.Email)

			DECLARE @status int
			SELECT @status = (
				SELECT u.UserStatusId
				FROM dbo.Users as u
				WHERE @Email = u.Email)

			IF @isConfirmed = 1 AND @status = 1

				BEGIN

					SELECT 
						u.[Id]
						,Roles = (
							SELECT r.Name
							FROM dbo.Roles AS r INNER JOIN dbo.UserRoles AS ur
								ON r.Id = ur.RoleId
							WHERE u.Id = ur.UserId
							FOR JSON AUTO
							)
						,u.[Password]

					FROM [dbo].[Users] as u
					WHERE Email = @Email

				END

			ELSE
				THROW 50000, 'User is not confirmed/active', 1
END
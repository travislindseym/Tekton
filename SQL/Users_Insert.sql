USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Users_Insert]    Script Date: 9/1/2022 10:02:21 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Travis Lindsey
-- Create date: 2022-07-27
-- Description: Inserts new User record
-- Code Reviewer: Chris Carter

-- MODIFIED BY: Riley Dickey
-- MODIFIED DATE: 2022-08-17
-- Code Reviewer:
-- Note: Added newRefType

-- MODIFIED BY: Brandon White
-- MODIFIED DATE: 2022-08-17
-- Code Reviewer:
-- Note: Added RoleId input
-- =============================================
ALTER   proc [dbo].[Users_Insert]

			@Email nvarchar(255)
			,@Password varchar(100)
			,@newRefType nvarchar(50)
			,@RoleId int
			,@Id int OUTPUT


as

/* --- TEST CODE ---

	DECLARE @Id int = 0

	DECLARE @Email nvarchar(255) = '1385453455@test.com'
			,@Password varchar(100) = 'passTest'
			,@newRefType nvarchar(50) = ''
			,@RoleId int = 2

	EXECUTE dbo.Users_Insert
			@Email
			,@Password
			,@newRefType
			,@RoleId
			,@Id OUTPUT

*/ --- END TEST CODE ---

IF(@RoleId != 2 AND @RoleId != 3)

BEGIN

DECLARE @RefTypeId int
		INSERT INTO [dbo].[Users]
			([Email]
			,[Password])

			VALUES
				(@Email
				,@Password)

		SET @Id = SCOPE_IDENTITY()
		IF (@newRefType != '')

			BEGIN
			INSERT INTO [dbo].ReferenceTypes ([name]) 
			VALUES (@newRefType)

			END
		
		INSERT INTO [dbo].[UserRoles]
			([UserId]
			,[RoleId])

			VALUES
				(@Id
				,@RoleId)

		

END
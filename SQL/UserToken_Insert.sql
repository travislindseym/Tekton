USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[UserTokens_Insert]    Script Date: 9/1/2022 9:58:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Travis Lindsey
-- Create date: 2022-07-29
-- Description: Inserts new User Token
-- Code Reviewer: Collin Schneide

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
ALTER   proc [dbo].[UserTokens_Insert]

			@Token varchar(200)
			,@UserId int
			,@TokenType int

as

/* --- TEST CODE ---

			DECLARE @Token varchar(200) = 'ABC-123-TEST'
					,@UserId int = 1
					,@TokenType int = 1

			EXECUTE dbo.UserTokens_Insert
					@Token
					,@UserId
					,@TokenType

			SELECT * FROM dbo.UserTokens

*/ --- END TEST CODE ---

BEGIN

			INSERT INTO [dbo].[UserTokens]
				([Token]
				,[UserId]
				,[TokenType])

			VALUES
				(@Token
				,@UserId
				,@TokenType)

			SET @Token = SCOPE_IDENTITY()



END
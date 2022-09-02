USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Users_Confirm]    Script Date: 9/1/2022 10:08:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Travis Lindsey
-- Create date: 2022-07-27
-- Description: Updates the IsConfirmed column to true and sets status to active in the User record. Usually to be used after confirming the email of the user.
-- Code Reviewer: Chris Carter

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
ALTER   proc [dbo].[Users_Confirm]

			@Token varchar(200)

as

/* --- TEST CODE ---

			DECLARE @Token varchar(200) = '05d9d70b-6b88-45e6-8f56-8b667f605d72'

			EXECUTE dbo.Users_Confirm
					@Token

*/ --- END TEST CODE ---

BEGIN

			DECLARE @DateMod datetime2 = GETUTCDATE()
			DECLARE @userId int = (
						SELECT ut.UserId
						FROM dbo.UserTokens as ut WHERE @Token = ut.Token)

			UPDATE [dbo].[Users]
				SET [IsConfirmed] = 1
					,[UserStatusId] = 1
					,[DateModified] = @DateMod
				WHERE Id = @userId

END
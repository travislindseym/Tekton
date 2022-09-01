USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Users_SelectAll]    Script Date: 9/1/2022 10:16:07 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Travis Lindsey
-- Create date: 2022-07-27
-- Description: Selects all User records (paginated)
-- Code Reviewer: Chris Carter

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
ALTER   proc [dbo].[Users_SelectAll]

			@PageIndex int
			,@PageSize int

as

/* --- TEST CODE ---

			DECLARE @PageIndex int = 0
					,@PageSize int = 1
			
			EXECUTE dbo.Users_SelectAll
					@PageIndex
					,@PageSize


*/ --- END TEST CODE ---

BEGIN

			DECLARE @Offset int = @PageIndex * @PageSize

			SELECT [Id]
					,[Email]
					,[IsConfirmed]
					,[UserStatusId]
					,[DateCreated]
					,[DateModified]
					,[TotalCount] = COUNT(1) OVER()

			FROM [dbo].[Users]
			ORDER BY Id

			OFFSET @Offset Rows
			Fetch Next @PageSize Rows ONLY

END
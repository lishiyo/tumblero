class Api::CommentsController < ApplicationController
	before_action :require_logged_in, only: [:create, :new, :destroy]

	# POST /comments
	# if you create a comment, you actually create to source_post
  def create
		Comment.transaction do		
			@post = Post.find(comment_params[:post_id])
			@author = @post.user
			
			if @post.reblogged		
				new_params = comment_params
				new_params[:post_id] = @post.source_id
				@comment = current_user.comments.build(new_params)
			else
				@comment = current_user.comments.build(comment_params)
			end			
			
		end
		
		if @comment.save && create_with_notification(@author, @comment)
			respond_to do |format|
				format.json { 
					render partial: 'comment', 
					locals: { comment: @comment } }
			end
		else
			render json: @comment.errors.full_messages, status: 422
		end
  end
	
	def create_with_notification(author, comment)
		note_params = {}
		note_params[:notification_type] = "Comment"
		note_params[:noter_id] = current_user.id
		note_params[:notification_id] = comment_params[:post_id]

		author.get_notified(note_params)
	end
	
	# GET /comments/:id
	def show
    @comment = Comment.find_by_id(params[:id])
    @new_comment = Comment.new(
      post_id: @comment.post_id, parent_comment_id: @comment.id
    )

		render 'show' # comments/show.json.jbuilder
  end
	
	def destroy
		@comment = Comment.find_by_id(params[:id])
		@comment.destroy!
		
		render json: nil
	end
	

  private
	
  def comment_params
    params.require(:comment).permit(:body, :post_id, :parent_comment_id)
  end
end

class Api::CommentsController < ApplicationController
	before_action :require_logged_in, only: [:create, :new, :destroy]

	# POST /comments
  def create
		@comment = current_user.comments.build(comment_params)

    if @comment.save
			
			respond_to do |format|
				format.html { redirect_to post_url(@comment.post_id) }
				format.json { render json: @comment }
			end
      
    else
			render json: @comment.errors.full_messages, status: 422
    end
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

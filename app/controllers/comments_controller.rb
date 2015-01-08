class CommentsController < ApplicationController
	before_action :require_logged_in, only: [:create, :new, :destroy]

	# POST /comments
  def create
    @comment = current_user.comments.new(comment_params)

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

		render :show # comments/show.json.jbuilder
  end
	
	def destroy
		@comment = Comment.find_by_id(params[:id])
		@comment.destroy!
		
		render json: nil
	end
	
	
# 	def create
		
# 		@comment = Comment.build_from(@post, comment_params[:user_id], comment_params[:body])
# 		@comment.parent_id = comment_params[:parent_id]
		
# 		if @comment.save
# 			respond_to do |format|
# 				format.json { render json: @comment }
# 			end
# 		else
# 			render json: nil, status: 422
# 		end
# 	end

#   def new
#     @comment = Comment.new(post_id: params[:post_id])
#     render :new
#   end

 

  private
	
  def comment_params
    params.require(:comment).permit(:body, :post_id, :parent_comment_id)
  end
end

class Api::TaggingsController < ApplicationController
	
	def index
		@post = Post.find(params[:post_id])
		@taggings = @post.taggings
		render json: @taggings
	end
	
	def show
		@tagging = Tagging.find(params[:id])
		render json: @tagging
	end
	
	# POST /taggings
	def create
		@tagging = current_user.taggings.build(tagging_params)
		if @tagging.save
			render json: @tagging
		else
			render @tagging.errors.full_messages, status: 422
		end
	end
	
	def destroy
		@tagging = Tagging.find(params[:id])
		@tagging.destroy!
		
		render nil
	end
	
	private
	
	def tagging_parmas
		params.require(:tagging).permit(:taggable_type, :taggable_id, :name, :user_id)
	end
end

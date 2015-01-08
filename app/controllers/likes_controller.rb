class LikesController < ApplicationController
	
	before_action :require_logged_in
	
	
	def create
		@like = current_user.likings.build(
			likeable_type: params[:likeable_type], 
			likeable_id: params[:likeable_id])
		
		if @like.save
			render json: @like
		else
			render json: @like.errors.full_messages, status: 422
		end
	end
	
	def destroy
		@like = Like.find_by(likeable_type: params[:likeable_type], likeable_id: params[:likeable_id])
		@like.destroy!
		
		render json: nil
	end
	
	private
	
	# send up :likeable_type, :likeable_id (:user_id always current_user)
	def like_params
		params.permit(:likeable_type, :likeable_id)
	end
	
end

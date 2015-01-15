class Api::LikesController < ApplicationController
	
	before_action :require_logged_in
	before_action :get_likeable, only: [:create, :destroy]
	
	def create_with_notification!
		Like.transaction do
			# a reblogged post
			author = @likeable.user
			note_params = {}
			note_params[:notification_type] = "Like"
			note_params[:noter_id] = current_user.id
			
			if params[:likeable_type] == 'Post' && @likeable.reblogged
				@like = current_user.likings.build(
					likeable_type: params[:likeable_type], 
					likeable_id: @likeable.source_id)
				
				note_params[:notification_id] = @likeable.source_id
				author.get_notified(note_params)
				
			elsif params[:likeable_type] == 'Post'
				@like = current_user.likings.build(
					likeable_type: params[:likeable_type],
					likeable_id: params[:likeable_id])
				
				note_params[:notification_id] = params[:likeable_id]
				author.get_notified(note_params)
				
			else # a comment
				@like = current_user.likings.build(
					likeable_type: params[:likeable_type],
					likeable_id: params[:likeable_id])
			end
		end
		
		@like
	end
	
	def create
		create_with_notification!

		if @like.save
			render json: @like
		else
			render json: @like.errors.full_messages, status: 422
		end
	end
	
	def destroy
		if params[:likeable_type] === 'Post' && @likeable.reblogged
			@like = Like.find_by(likeable_type: params[:likeable_type], likeable_id: @likeable.source_id)
			@like.destroy!
		else
			@like = Like.find_by(likeable_type: params[:likeable_type], likeable_id: params[:likeable_id])
			@like.destroy!
		end
	
		render json: nil
	end
	
	private
	
	# either Post or Comment
	def get_likeable
		@likeable = params[:likeable_type].constantize.find(params[:likeable_id])
	end
	
	# send up :likeable_type, :likeable_id (:user_id always current_user)
	def like_params
		params.permit(:likeable_type, :likeable_id)
	end
	
end

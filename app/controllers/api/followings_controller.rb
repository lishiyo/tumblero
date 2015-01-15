class Api::FollowingsController < ApplicationController
  before_action :require_logged_in

  def create
		Following.transaction do 
			@follow = current_user.followings.build(
				blog_id: params[:blog_id])
			
			@author = Blog.joins(:user).find(params[:blog_id]).user
		end

    if @follow.save && create_with_notification(@author)
      render json: @follow
		else
			render json: @follow.errors.full_messages, status: 422
    end
		
  end
	
	def create_with_notification(author)
		note_params = {}
		note_params[:notification_type] = "Following"
		note_params[:noter_id] = current_user.id
		note_params[:notification_id] = params[:blog_id]
		
		author.get_notified(note_params)
	end

  def destroy
		@follow = current_user.followings.find_by(blog_id: params[:blog_id])
    @follow.destroy!

    respond_to do |format|
      format.html { redirect_to request.referrer }
      format.json { render json: nil }
    end
  end
	
end

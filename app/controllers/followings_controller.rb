class FollowingsController < ApplicationController
  before_action :require_logged_in

  def create
   
		@follow = current_user.followings.build(blog_id: params[:blog_id])

    respond_to do |format|
			if @follow.save
      	format.html { redirect_to request.referrer }
      	format.json { render json: @follow }
			else			
				format.json { render json: @follow.errors.full_messages, status: 422 }
			end
    end
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

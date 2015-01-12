class Api::DashboardsController < ApplicationController
	
	before_action :require_logged_in
	
	# GET api/dashboard
	def show
		@dashboard = current_user.dashboard
		@posts = @dashboard.followed_posts.page(params[:page])
		
		render json: @dashboard.as_json(:include => { followed_posts: { methods: [:count_notes, :likers_ids], include: :taggings } })
		
# 		render json: { models: @posts, page: params[:page], total_pages: @posts.total_pages }
	end
	
end

class Api::DashboardsController < ApplicationController
	
	before_action :require_logged_in
	
	# GET /api/dashboard
	def show
		@dashboard = current_user.dashboard
		@posts = @dashboard.followed_posts.page(params[:page])
		
		render 'show'
	end
	
	def tags
		@dashboard = current_user.dashboard
		render json: @dashboard.tags
	end
	
	# GET /api/dashboard/posts
	def posts
		@dashboard = current_user.dashboard
		@posts = @dashboard.followed_posts.page(params[:page])
		
		render 'api/posts/index'		
	end
	
	# GET /api/dashboard/liked_posts
	def liked_posts
		@dashboard = current_user.dashboard
		@liked_posts = current_user.liked_posts.page(params[:page])
		
		render 'liked_posts'
	end
	
end

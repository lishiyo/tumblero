class Api::DashboardsController < ApplicationController
	
	before_action :require_logged_in
	
	def tags
		@dashboard = current_user.dashboard
		render json: @dashboard.tags
	end
	
	# GET /api/dashboard/posts
	def posts
		@dashboard = current_user.dashboard
		@posts = @dashboard.followed_posts.page(params[:page])
		
		render 'api/posts/index'
		
# 		render :json => {
# 			:models => @posts.as_json(methods: [:notes_count, :likers_ids, :recent_notes_count], include: :taggings),
#         :page => params[:page],
#         :total_pages => @posts.total_pages # thanks kaminari!
#     }
		
	end
	
	# GET /api/dashboard
	def show
		@dashboard = current_user.dashboard
		@posts = @dashboard.followed_posts.page(params[:page])
		@liked_posts = current_user.liked_posts.page(params[:page])
		
		render 'show'
	end
	
end

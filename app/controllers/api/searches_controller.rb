class Api::SearchesController < ApplicationController
	
	def index
	
		# either one tag or string of tags
		query = params[:query] 

		if params[:blog_id]
			@search_results = Post.where(blog_id: params[:blog_id]).search_by_tags(query).page(params[:page])
		elsif params[:dashboard_id]
			dashboard = Dashboard.find(params[:dashboard_id])
			@search_results = dashboard.followed_posts.search_by_tags(query).page(params[:page])
		end

		render 'single_search'

	end
	
	# search through posts and blogs' tags 
	def tagged
    @search_results = PgSearch
      .multisearch(params[:query])
      .page(params[:page])
	end
	
	
end

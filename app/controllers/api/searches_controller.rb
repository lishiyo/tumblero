class Api::SearchesController < ApplicationController
	
	def index
	
		# SINGLE SEARCH through a dashboard or blog
		query = params[:query] 

		if params[:blog_id]
			@search_results = Post.where(blog_id: params[:blog_id]).search_by_tags(query).page(params[:page])
		elsif params[:dashboard_id]
			dashboard = Dashboard.find(params[:dashboard_id])
			@search_results = dashboard.followed_posts.search_by_tags(query).page(params[:page])
		end

		render 'single_search'

	end
	
	# SINGLE search through blogs that are not yours
	def blogs
		if params[:query] && params[:query].empty?
			@search_results = Blog.where.not(user_id: current_user.id).page(params[:page]).per(5)
		else
			@search_results = Blog.where.not(user_id: current_user.id).search_by_tags(params[:query]).page(params[:page]).per(5)
		end
		
		render 'single_search'
	end
	
	# SINGLE SEARCH
	def posts
		if params[:query] && params[:query].empty?
			@search_results = Post.page(params[:page])
		else
			@search_results = Post.search_by_tags(params[:query]).page(params[:page])
		end
		render 'single_search'
	end
	
	
	# MULTISEARCH - search through both posts and blogs' tags 
	def all
		query = (params[:term] || params[:query])
		
    @search_results = PgSearch
		.multisearch(query)
			.page(params[:page])
		
		render 'multi_search'
	end
	
	
end

class Api::SearchesController < ApplicationController
	
	# SINGLE SEARCH through a dashboard or blog
	def index			
		query = params[:query] 

		if params[:blog_id]
			@search_results = Post.where(blog_id: params[:blog_id]).search_by_tags(query).page(params[:page])
		elsif params[:dashboard_id]
			dashboard = Dashboard.find(params[:dashboard_id])
			@search_results = dashboard.followed_posts.search_by_tags(query).page(params[:page])
		end

		render 'single_search'

	end
	
	# GET /explore
	# SINGLE SEARCH through index of all blogs that are not yours
	def blogs
		if params[:query] && params[:query].empty?
			@search_results = Blog.where(guest: false)
														.where.not(user_id: current_user.id)
														.order('followers_count DESC')
														.page(params[:page]).per(4)
		else
			@search_results = Blog.where(guest: false)
														.where.not(user_id: current_user.id)
														.search_by_tags(params[:query])
														.order('followers_count DESC')
														.page(params[:page]).per(4)
		end
		
		render 'single_search'
	end
	
	# SINGLE SEARCH through index of all posts (10 per page)
	def posts
		if params[:query] && params[:query].empty?
			@search_results = Post.where(guest: false).includes(:taggings).page(params[:page])
		else
			@search_results = Post.where(guest: false)
														.includes(:taggings)
														.search_by_tags(params[:query]).page(params[:page])
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

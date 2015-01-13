class Api::SearchesController < ApplicationController
	
	def index
	
		# either one tag or string of tags
		query = params[:query] 

		@search_results = Post.where(blog_id: params[:blog_id]).search_by_tags(query).page(params[:page])

		p @search_results
		
		render 'single_search'

	end
	
	
end

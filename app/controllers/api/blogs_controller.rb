class Api::BlogsController < ApplicationController
	
	before_action :require_logged_in
	
	# GET /explore/blogs 
	def index 
		@blogs = Blog.most_popular.where.not(user_id: current_user.id)
		render json: @blogs
	end
	
	def show
		@blog = Blog.includes(:posts).find(params[:id])
		@posts = @blog.posts.page(params[:page])
			
		render 'show'
		
# 		render json: @blog.as_json(:include => { posts: { methods: [:count_notes, :likers_ids], include: :taggings }})
		
# 		render :json => {
#         :models => @posts,
#         :page => params[:page],
#         :total_pages => @posts.total_pages # thanks kaminari!
#     }
		
	end
	
	def new
		@blog = current_user.blogs.new
		render json: @blog
	end
	
	def create		
		@blog = current_user.blogs.build(clean_params)
		if @blog.save
			render json: @blog
		else
			render json: @blog.errors.full_messages, status: 422
		end
	end
	
	# PUT api/blogs/:id
	def update
		@blog = Blog.find(params[:id])
		if @blog.update(clean_params)
			render json: @blog
		else
			render json: @blog.errors.full_messages, status: 422
		end
	end
	
	# POST/DELETE /blogs/:id/follow
	def follow
		@blog = Blog.find(params[:id])
		@following = current_user.followings.build(blog_id: @blog.id)
		if @following.save
			render json: @blog
		else
			render json: @blog.errors.full_messages, status: 422
		end
	end
	
	# GET /blogs/:id/tags
	def tags
		@blog = Blog.find(params[:id])
		render json: @blog.tags
	end
	
# 	def all_posts
# 		@blog = Blog.find(params[:id])
# 		@posts = @blog.posts
		
# 		render json: @posts.as_json(methods: [:notes_count, :likers, :recent_notes_count], include: :taggings)
# 	end
	
	
	private	
	
	def clean_params
		params = blog_params
		new_handle = blog_params[:handle].downcase.split(" ").join("-")
		params[:handle] = new_handle
		
		params
	end
	
	def get_blog
		@blog = Blog.includes(:posts).find(params[:id])
	end
	
	def blog_params
		params.require(:blog).permit(:avatar_url, :user_id, :name, :description, :handle)
	end
	
	
end

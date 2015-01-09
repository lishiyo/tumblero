class  Api::PostsController < ApplicationController
	
	before_action :set_post, only: [:show, :comments, :reblog, :new_comment]
	
	def index
		@blog = Blog.find(params[:blog_id])
		@posts = @blog.posts
		
		render json :@posts
	end
	
	def show	
		respond_to do |f| 
			f.json { render json: @post.to_json(methods: :count_notes, include: :taggings) }
		end
	end
	
	def new
		@post = Post.new
		render json @post
	end
	
	# post_params[:blog_id] comes from form
	def create
		@blog = Blog.find(post_params[:blog_id])
		@post = @blog.posts.build(post_params.except(:tags))
		@tags_array = post_params[:tags].split(",")
		
		if full_transact?
			respond_to do |format|
				format.html { redirect_to blog_url(blog) }
				format.json { render json: @post }
				format.js { render json: @post }
			end
		else
			flash.now[:errors] = "woops"
			render json: nil, status: 422
		end
	end
	
	# GET /posts/:id/reblog => open up reblog form
	# button_to '/posts/'+post.id+'/reblog'
	def reblog
		@post = Post.new
		@post.reblogged = true
	end
	
	# COMMENTS
	# GET /posts/:id/comments
	def comments
		render 'comments'
	end
	
	private

	def full_transact?
		Post.transaction do
			@post.save!
			@post.create_reblog_for!(@blog.id)
			@post.create_new_taggings!(@tags_array, current_user)
			
			return true
		end
		
		false
	end
	
	def set_post
		@post = Post.find(params[:id])
	end
	
	def post_params
		params.require(:post).permit(:blog_id, :title, :content, :filepicker_urls, :reblogged, :tags)
	end
	
	def comment_params
		params.require(:comment).permit(:body, :user_id, :parent_comment_id, :created_at, :updated_at, :post_id)
	end
	
end

class PostsController < ApplicationController
	
	before_action :get_blog, only: [:index, :new]
	before_action :get_post, only: [:show, :comments, :new_comment]
	
	
	def index
		@posts = @blog.posts
	end
	
	def show
		respond_to do |f| 
			f.html { render 'show'}
			f.json { render json: @post }
		end
	end
	
	def new
		@post = @blog.posts.new
	end
	
	def create
		blog = Blog.find(post_params[:blog_id])
		
		@post = blog.posts.build(post_params)
		if @post.save
			respond_to do |format|
				format.html { redirect_to blog_url(blog) }
				format.json { render json: @post }
				format.js { render json: @post }
			end
		else
			flash.now[:errors] = "woops"
			redirect_to :back
		end
	end
	
	def comments
		@all_comments = @post.comment_threads
		
		render 'comments'
	end
	
	def new_comment
		
		@comment = Comment.build_from(@post, comment_params[:user_id], comment_params[:body])
		@comment.parent_id = comment_params[:parent_id]
		
		if @comment.save
			respond_to do |format|
				format.json { render json: @comment }
			end
		else
			render json: nil, status: 422
		end
	end
	
	private
	
	def get_blog
		@blog = Blog.find(params[:blog_id])
	end
	
	def get_post
		@post = Post.find(params[:id])
	end
	
	def post_params
		params.require(:post).permit(:blog_id, :title, :content, :filepicker_urls)
	end
	
	def comment_params
		params.require(:comment).permit(:body, :user_id, :commentable_type, :commentable_id, :subject, :parent_id, :lft, :rgt, :title)
	end
	
end

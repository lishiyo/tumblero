class  Api::PostsController < ApplicationController
	
	wrap_parameters false
	
	before_action :set_post, only: [:show, :comments, :reblog, :new_comment]
	
	# GET api/blogs/:blog_id/posts
	def index
		@blog = Blog.find(params[:blog_id])
# 		@posts = @blog.posts
		# 		render json: @posts.as_json(methods: [:notes_count, :likers, :recent_notes_count], include: :taggings)
		
		@posts = @blog.posts.page(params[:page])
		
		render 'index'
		
# 		render :json => {
#         :models => @posts.as_json(methods: [:notes_count, :likers_ids, :recent_notes_count], include: :taggings),
#         :page => params[:page],
#         :total_pages => @posts.total_pages 
#     }
	end
	
	def show	
		respond_to do |f| 
			f.json { render json: @post.as_json(methods: [:notes_count, :likers_ids, :recent_notes_count], include: :taggings) }
		end
	end
	
	def new
		@post = Post.new
		render json: @post
	end
	
	# post_params[:blog_id] comes from form
	def create
		@blog = Blog.find(post_params[:blog_id])
		
		if post_params[:tags_string]
			@tags_array = post_params[:tags_string].split(",").map(&:strip)
			# make sure tags_string is joined correctly 
			post_params[:tags_string] = post_params[:tags_string]
				.split(",").map(&:strip).join(", ")
		end
			
		@post = @blog.posts.build(post_params)
		
		if full_transact?
			respond_to do |format|
				format.html { redirect_to blog_url(blog) }
				format.json { render json: @post.as_json(methods: [:notes_count, :likers_ids, :recent_notes_count], include: :taggings) }
			end
		else
			flash.now[:errors] = "woops"
			render json: nil, status: 422
		end
	end
	
	# POST /api/posts/:id/reblog 
	# create reblog for either self or ultimate source_post (if reblogged: true)
	def reblog
		@post = Post.find(params[:id])
		
		if @post.create_reblog_for!(post_params[:reblog_blog_id]) && create_with_notification!
			render json: @post.as_json(
				methods: [:notes_count, :likers_ids, :recent_notes_count],
				include: :taggings)
		else
			render json: @post.errors.full_messages
		end
	end
	
	def create_with_notification!
		Reblog.transaction do
			# a reblogged post
			author = @post.user
			note_params = {}
			note_params[:notification_type] = "Reblog"
			note_params[:noter_id] = current_user.id
			note_params[:notification_id] = @post.id
			
			author.get_notified(note_params)
			
			return true
		end
		
		false
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
			@post.create_new_taggings!(@tags_array, current_user) if @tags_array
			
			return true
		end
		
		false
	end
	
	def set_post
		@post = Post.find(params[:id])
	end
	
	def post_params
		params.require(:post).permit(:blog_id, :title, :content, :filepicker_urls, :tags_string, :reblogged, :reblog_blog_id, :source_id, :likes_count, :comments_count, :reblogs_count)
	end
	
	def comment_params
		params.require(:comment).permit(:body, :user_id, :parent_comment_id, :created_at, :updated_at, :post_id)
	end
	
end

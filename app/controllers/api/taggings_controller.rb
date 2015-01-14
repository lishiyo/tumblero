class Api::TaggingsController < ApplicationController
	
	# all tags for all posts
	def all
		tag_names = Tagging.all.pluck('name').uniq
		render json: tag_names
	end
	
	# all tags for a certain blog or dashboard
	def index
		if params[:blog_id]
			@blog = Blog.find(params[:blog_id])
			render json: @blog.as_json(methods: :tags)
		elsif params[:post_id]
			@post = Post.find(params[:post_id])
			render json: @post.as_json(includes: :taggings)
		else
			@dashboard = current_user.dashboard
			render json: @dashboard.as_json(methods: :tags)
		end
	end
	
	def tags
		
	end
	
	def show
		@tagging = Tagging.find(params[:id])
		render json: @tagging
	end
	
	# POST /taggings
	def create
		@tagging = current_user.taggings.build(tagging_params)
		if @tagging.save
			render json: @tagging
		else
			render @tagging.errors.full_messages, status: 422
		end
	end
	
	def destroy
		@tagging = Tagging.find(params[:id])
		@tagging.destroy!
		
		render nil
	end
	
	private
	
	def tagging_parmas
		params.require(:tagging).permit(:taggable_type, :taggable_id, :name, :user_id)
	end
end

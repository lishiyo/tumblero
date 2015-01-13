json.extract! @blog, :user_id, :id, :avatar_url, :description, :handle, :posts_count, :followers_count, :created_at, :updated_at, :name

json.page params[:page]
json.total_pages @posts.total_pages

json.models @posts do |post|

	json.extract! post, :id, :blog_id, :content, :filepicker_urls, :title, :reblogged, :source_id, :created_at, :updated_at, :likes_count, :reblogs_count, :count_notes, :comments_count, :likers_ids, :taggings
	
end


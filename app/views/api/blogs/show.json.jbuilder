json.extract! @blog, :user_id, :id, :avatar_url, :description, :handle, :posts_count, :followers_count, :created_at, :updated_at, :name, :tags, :tags_string

json._page params[:page]
json.total_pages @posts.total_pages

json.models @posts do |post|

	json.extract! post, :id, :blog_id, :content, :filepicker_urls, :title, :reblogged, :source_id, :created_at, :updated_at, :likes_count, :reblogs_count, :notes_count, :recent_notes_count, :comments_count, :likers_ids, :taggings, :tags_string
	
end


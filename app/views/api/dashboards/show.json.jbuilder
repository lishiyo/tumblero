json.extract! @dashboard, :user_id, :id, :created_at, :updated_at

json.page params[:page]
json.total_pages @posts.total_pages

json.models @posts do |post|

	json.extract! post, :id, :blog_id, :content, :filepicker_urls, :title, :reblogged, :source_id, :created_at, :updated_at, :likes_count, :reblogs_count, :count_notes, :comments_count, :likers_ids, :taggings
	
end


json.extract! @dashboard, :user_id, :id, :created_at, :updated_at, :tags

json._page params[:page]
json.total_pages @liked_posts.total_pages

json.liked_posts @liked_posts do |post|
	json.extract! post, :id, :blog_id, :content, :filepicker_urls, :title, :reblogged, :source_id, :created_at, :updated_at, :likes_count, :reblogs_count, :notes_count, :recent_notes_count, :comments_count, :likers_ids, :taggings, :tags_string
end
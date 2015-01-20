json.extract! @post, :id, :blog_id, :content, :filepicker_urls, :title, :created_at, :updated_at, :reblogged, :source_id, :comments_count, :likes_count, :reblogs_count, :tags_string, :notes_count, :likers_ids, :recent_notes_count
json.blog_handle @post.blog.handle

json.taggings @post.taggings, :id, :taggable_id, :name, :user_id, :taggable_type, :created_at, :updated_at

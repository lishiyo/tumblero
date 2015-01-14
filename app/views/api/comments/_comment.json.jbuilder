json.extract! comment, :id, :post_id, :user_id, :body, :parent_comment_id, :created_at, :updated_at, :likes_count
json.likers_ids comment.likers_ids
json.main_blog_id comment.main_blog_id
json.main_blog_handle comment.main_blog_handle

json.child_comments comment.ordered_child_comments do |child|
	json.partial! 'comments/comment', comment: child
	json.likers_ids comment.likers_ids
	json.main_blog_id comment.main_blog_id
	json.main_blog_handle comment.main_blog_handle
end

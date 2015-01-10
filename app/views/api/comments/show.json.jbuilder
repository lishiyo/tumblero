json.extract! @comment, :id, :post_id, :user_id, :body, :parent_comment_id, :created_at, :updated_at
json.count_likes @comment.count_likes

json.child_comments @comment.ordered_child_comments do |child|
	json.extract! child, :id, :post_id, :user_id, :body, :parent_comment_id, :created_at, :updated_at
	json.count_likes child.count_likes
end
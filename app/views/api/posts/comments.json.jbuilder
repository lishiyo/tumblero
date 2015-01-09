json.array! @post.comments.includes(:child_comments), partial: 'api/comments/comment', as: :comment

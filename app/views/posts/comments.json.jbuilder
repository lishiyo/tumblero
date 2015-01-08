json.array! @post.comments.includes(:child_comments), partial: 'comments/comment', as: :comment

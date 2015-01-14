json.extract! @user, :id, :email, :created_at, :updated_at, :main_blog_id
json.liked_posts_ids @user.liked_posts_ids
json.liked_comments_ids @user.liked_comments_ids
json.followed_blogs_ids @user.followed_blogs_ids

json.blogs @user.blogs, :id, :user_id, :name, :description, :avatar_url, :created_at, :updated_at
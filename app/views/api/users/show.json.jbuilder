json.extract! @user, :id, :email, :created_at, :updated_at, :session_token

json.blogs @user.blogs, :id, :user_id, :name, :description, :avatar_url, :created_at, :updated_at
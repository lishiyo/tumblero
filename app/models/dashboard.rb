class Dashboard < ActiveRecord::Base
	
	belongs_to :user	
# 	has_many :own_posts, through: :user, source: :posts
	
	has_many :followed_blogs, through: :user, source: :followed_blogs
	has_many :followed_posts, through: :followed_blogs, source: :posts
	
	validates :user_id, presence: :true
	
# 	def posts
# 		followed_posts.sort_by{|post| post.created_at }.reverse
# 	end
	
end

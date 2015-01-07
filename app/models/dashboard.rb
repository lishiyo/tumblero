class Dashboard < ActiveRecord::Base
	
	belongs_to :user
	
	has_many :own_posts, through: :user, source: :posts
	
	has_many :followed_blogs, through: :user, source: :followed_blogs
	has_many :followed_posts, through: :followed_blogs, source: :posts
	
	validates :user_id, presence: :true
	
	def all_posts
		own_posts = Post.joins(blogs: :users).where(user_id: current_user.id)
		
# 		all_posts = self.own_posts.concat(self.followed_posts).sort_by {|post| post.created_at }
		
		own_posts.sort_by{|p| p.created_at}
	end
	
end

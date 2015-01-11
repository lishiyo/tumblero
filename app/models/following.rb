class Following < ActiveRecord::Base
	
	belongs_to :user, counter_cache: :followed_blogs_count
	belongs_to :blog, counter_cache: :followers_count
	
	validates :user_id, :blog_id, presence: :true
	validates :blog_id, uniqueness: { scope: :user_id }
	validate :user_cannot_follow_own_blog
	
	private
	
	def user_cannot_follow_own_blog
		errors.add(:user, "cannot follow their own blog") if user == blog.user
	end
	
end

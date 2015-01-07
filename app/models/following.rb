class Following < ActiveRecord::Base
	
	belongs_to :user
	belongs_to :blog
	
	validates :user_id, :blog_id, presence: :true
	validates :blog_id, uniqueness: { scope: :user_id }
	
end

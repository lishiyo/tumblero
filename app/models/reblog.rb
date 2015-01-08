class Reblog < ActiveRecord::Base
	
	belongs_to :blog
	belongs_to :post
	
	# note that a blog can reblog a post multiple times
	validates :blog_id, :post_id, presence: :true
	
	
end

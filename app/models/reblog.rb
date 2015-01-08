class Reblog < ActiveRecord::Base
	
	belongs_to :blog
	belongs_to :post
	
	# note that a blog can reblog a post multiple times
	validates :blog, :post, presence: :true
	
	
end

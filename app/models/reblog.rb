class Reblog < ActiveRecord::Base
	
	belongs_to :blog
	belongs_to :post, counter_cache: true
	
	# note that a blog can reblog a post multiple times
	validates :blog, :post, presence: :true
	
end

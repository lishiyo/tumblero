class Like < ActiveRecord::Base
	
	belongs_to :likeable, polymorphic: true
	belongs_to :user
	
	validates :likeable_type, :likeable_id, presence: true
	# user can only like this once
	validates :likeable_id, uniqueness: { scope: [:likeable_id, :user_id] }
	
end

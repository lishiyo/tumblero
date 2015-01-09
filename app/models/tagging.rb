class Tagging < ActiveRecord::Base
	
	belongs_to :taggable, polymorphic: true
	belongs_to :user
	
	validates :name, :taggable_type, :taggable_id, presence: true
	# unique tags for each post
	validates :name, uniqueness: { scope: [:taggable_id, :taggable_type] }, length: { maximum: 140 }
	
end

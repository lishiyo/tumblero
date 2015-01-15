class Like < ActiveRecord::Base
	
	belongs_to :likeable, polymorphic: true
	belongs_to :user
	
	validates :likeable_type, :likeable_id, presence: true
	# user can only like this once
	validates :likeable_id, uniqueness: { scope: [:likeable_id, :user_id] }
	
	before_create :increment_counter
	before_destroy :decrement_counter
	
	
	def increment_counter
		self.likeable_type.constantize.increment_counter("likes_count", self.likeable_id)
		self.update_source('increment')
  end

	def decrement_counter
		self.likeable_type.constantize.decrement_counter("likes_count", self.likeable_id)
		self.update_source('decrement')
  end
	
	# update likes_count for Post
	def update_source(direction)
		return unless self.likeable_type == 'Post'
		
		likeable = self.likeable_type.constantize.find(self.likeable_id)
		if likeable.reblogged
			source = Post.find(likeable.source_id)
			if direction == 'increment'
				Post.increment_counter("likes_count", source.id)
			else
				Post.decrement_counter("likes_count", source.id)
			end
		end
	end

end

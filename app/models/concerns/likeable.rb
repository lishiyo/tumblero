module Likeable
  extend ActiveSupport::Concern

	# try before_add or before_create
  included do
		has_many :likes, as: :likeable, dependent: :destroy, counter_cache: true
# 		has_many :likes, as: :likeable, dependent: :destroy, before_add: :increment_counter, before_remove: :decrement_counter
  end
	
#   def increment_counter
# 		self.likeable_type.constantize.increment_counter("#{self.likeable_type.downcase.pluralize}_count", self.taxonomy_id)
#   end

#   def decrement_counter
#     self.taxonomy_type.constantize.decrement_counter("#{self.classifiable_type.downcase.pluralize}_count", self.taxonomy_id)
#   end

  def count_likes
		likes.size
	end
end
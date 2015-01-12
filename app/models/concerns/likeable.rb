module Likeable
  extend ActiveSupport::Concern

	# try before_add or before_create
  included do
# 		has_many :likes, as: :likeable, dependent: :destroy, counter_cache: true
		has_many :likes, as: :likeable, dependent: :destroy
  end
	
	
end
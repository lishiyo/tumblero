module Likeable
  extend ActiveSupport::Concern

  included do
		has_many :likes, as: :likeable, dependent: :destroy
  end

  def count_likes
		likes.count
	end
end
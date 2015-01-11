module Taggable
  extend ActiveSupport::Concern

  included do
		has_many :taggings, as: :taggable, dependent: :destroy, autosave: true
  end

  def tag_names
		tags.pluck(:name)
  end
end
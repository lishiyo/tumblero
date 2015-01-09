module Taggable
  extend ActiveSupport::Concern

  included do
		has_many :taggings, as: :taggable, dependent: :destroy, autosave: true
  end

  def tag_names
    tags.map(&:name)
  end
end
class Post < ActiveRecord::Base
	
	acts_as_commentable
	
	belongs_to :blog
	has_one :author, through: :blog, source: :user
	
	validates :content, presence: true, unless: ->(post){ post.filepicker_urls.present? }
	validates :filepicker_urls, presence: true, unless: ->(post){ post.content.present? }
	validates :blog, presence: :true
	
end

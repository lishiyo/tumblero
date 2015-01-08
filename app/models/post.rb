class Post < ActiveRecord::Base
	
	acts_as_commentable
	
	belongs_to :blog
	has_one :author, through: :blog, source: :user
	has_many :likes, as: :likeable, dependent: :destroy
	# if you delete a post, it will disappear on its original blog but remain on the reblogging_blog
	has_many :reblogs, inverse_of: :post, dependent: :destroy
	has_many :reblogging_blogs, through: :reblogs, source: :blog
	
	validates :content, presence: true, unless: ->(post){ post.filepicker_urls.present? }
	validates :filepicker_urls, presence: true, unless: ->(post){ post.content.present? }
	validates :blog, presence: :true
	
	def count_likes
		likes.count
	end
	
end

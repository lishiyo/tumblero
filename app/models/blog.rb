class Blog < ActiveRecord::Base
	
	belongs_to :user
	has_many :posts, inverse_of: :blog
	has_many :followings, dependent: :destroy
	has_many :followers, through: :followings, source: :user
	has_many :taggings, through: :posts
	
	has_many :reblogs, inverse_of: :blog, dependent: :destroy
	has_many :reblogged_posts, through: :reblogs, source: :post
	
	validates :name, :user, :handle, presence: true
	validates :handle, uniqueness: true
	validates :description, length: { maximum: 300 }
	validate :handle_must_be_one_word

	
	private
	
	def handle_must_be_one_word
		unless handle.chars.all? {|char| char.match(/(\w+|-)/) }
			errors.add(:blog, "handle can contain only letters, digits, or underscores/dashes")
		end
	end
	
	
end

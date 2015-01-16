class Blog < ActiveRecord::Base
	include PgSearch
	
	multisearchable :against => :tags, if: proc{ |p| true }
	pg_search_scope :search_by_tags, :associated_against => {
    :posts => :tags_string
  }
			
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

		
	
		# top five blogs that gained the most followers in 1 day, month, year
	def self.trending_in(time)
		Blog.joins(:followings).where('followings.created_at > ?', 1.week.ago).order('blogs.followers_count DESC').limit(5)	
	end
	
		# 10 most popular all-time
	def self.most_popular
		Blog.joins(:followings).order('blogs.followers_count DESC')
	end
	
	def tags
		self.taggings.pluck('name').uniq
	end
		
	def tags_string
		Post.where(blog_id: self.id).pluck('tags_string').uniq
	end
		
	private
		
	def handle_must_be_one_word
		unless handle.chars.all? {|char| char.match(/(\w+|-)/) }
			errors.add(:blog, "handle can contain only letters, digits, or underscores/dashes")
		end
	end
	
	
end

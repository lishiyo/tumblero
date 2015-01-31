class Blog < ActiveRecord::Base
	include PgSearch
	
	multisearchable :against => :tags, if: proc{ |p| true }
	pg_search_scope :search_by_tags, :associated_against => {
    :posts => :tags_string
  }
			
	belongs_to :user
	has_many :posts, inverse_of: :blog, dependent: :destroy
	has_many :followings, dependent: :destroy
	has_many :followers, through: :followings, source: :user
	has_many :taggings, through: :posts
	
	has_many :reblogs, inverse_of: :blog, dependent: :destroy
	has_many :reblogged_posts, through: :reblogs, source: :post
	
	validates :name, :user, :handle, presence: true
	validates :handle, uniqueness: true
	validates :description, length: { maximum: 300 }
	validate :handle_must_be_one_word
	
	# GUEST blogs 
	def create_guest_posts!
		
		post_params = {
			title: "Whoa! Welcome to Tumblero!",
			content: "Hey there, stranger! Glad to see you here. Why not:<br><ul><li>Create a new post (try drag-and-dropping some images!)</li><li>Follow some more blogs? (Click&nbsp;<a target=\"_blank\" rel=\"nofollow\" href=\"http://tumblero.com/#/explore\">Explore</a>&nbsp;on the top bar.)</li><li>Reblog the posts that you'd like to share with your followers</li><li>Leave a comment or two on a post</li><li>Search by tags via:<ul><li>the navigation searchbar to search throughout the whole site</li><li>the blog or dash searchbar to search through a single blog or dash</li></ul></li><li>Sort your dashboard or a blog by popularity or trending in the last 24 hours</li></ul>",
			filepicker_urls: "https://www.filepicker.io/api/file/cczc3wezQC5gzQPLTdvQ",
			reblogged: false,
			source_id: nil,
			guest: true,
			tags_string: "demo, tutorial"
			}
		
		self.posts.create(post_params)
		self
	end
		
	# top five blogs that gained the most followers in 1 day, month, year
	def self.trending_in(time)
		Blog.joins('LEFT JOIN followings ON followings.blog_id = blogs.id')
				.where('followings.created_at > ?', 1.week.ago)
				.order('blogs.followers_count DESC')
				.limit(5)	
	end
	
		# top 5 most popular all-time
	def self.most_popular
		Blog.joins('LEFT JOIN followings ON followings.blog_id = blogs.id')
				.order('blogs.followers_count DESC')
				.limit(5)
	end
	
	# last five tags
	def tags
		self.taggings.pluck('name').uniq.take(5)
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

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
		
		first_post_params = {
			title: nil,
			content: nil,      
# 			source_id: nil,
# 			reblogged: false,
			filepicker_urls: "https://www.filepicker.io/api/file/gl6f12IeRu6xzfbYwG6F",                                                 
			reblogged: true,
			source_id: 20,
			guest: true,
			tags_string: "cute, random, tutorial, demo"
			}
		
		second_post_params = {
			title: "Whoa! Welcome to Tumblero!",
			content: "<p>Hey there, stranger! Glad to see you drop by. Why not:<br></p><ul><li>Create a new post (try drag-and-dropping some images!)</li><li>Follow some more blogs! (Click <a target=\"_blank\" rel=\"nofollow\" href=\"http://tumblero.com/#/explore\">Explore</a>&nbsp;on the top bar.)</li><li>Reblog posts to share with your followers</li><li>Leave a comment or two on a post</li><li>Search by tags via:<ul><li>the navigation searchbar to search throughout the whole site</li><li>the blog or dash searchbar to search through a single blog or dash</li></ul></li><li>Sort your dashboard or a blog by popularity or trending in the last 24 hours</li><li>Curate your blogs by editing or deleting posts - all inline</li><li>Create more blogs (as many as you want) and edit them over in your <b><i></i><a target=\"_blank\" rel=\"nofollow\" href=\"http://tumblero.com/#/users/profile\">Profile</a><i></i></b></li><li>Check out your notifications and recent activity feed in your <a target=\"_blank\" rel=\"nofollow\" href=\"http://tumblero.com/#/users/profile\"><b>Profile</b></a><b> </b>as well!</li></ul>",
			filepicker_urls: "https://www.filepicker.io/api/file/cczc3wezQC5gzQPLTdvQ",
			reblogged: true,
			source_id: 21,
			guest: true,
# 			source_id: nil,
# 			reblogged: false,
			tags_string: "demo, tutorial, official"
			}
		
		# Create guest blogs as reblogs of official tutorial posts
		first_post = self.posts.create(first_post_params)	
		second_post = self.posts.create(second_post_params)
		first_post.create_reblog_for!(self.id)
		second_post.create_reblog_for!(self.id)
		
		# Create post taggings
		guest = self.user
		first_tags_array = ["cute", "random", "tutorial", "demo"]
		second_tags_array = ["demo", "tutorial", "official"]
		first_post.create_new_taggings!(first_tags_array, guest)
		second_post.create_new_taggings!(second_tags_array, guest)
		
		# PRODUCTION - notify admin account of reblogged posts 
		guest = self.user
		notify_guest_creation(guest.id, first_post.id)
		notify_guest_creation(guest.id, second_post.id)
		
		self
	end
		
	def notify_guest_creation(guest_id, post_id)
		author = User.find(39) # supreme-leader@tumblero.com
		note_params = {}
		note_params[:notification_type] = "Reblog"
		note_params[:noter_id] = guest_id
		note_params[:notification_id] = post_id

		author.get_notified(note_params)
	end
		
	# top five blogs that gained the most followers in 1 day, month, year
	def self.trending_in(time)
		Blog.joins('LEFT JOIN followings ON followings.blog_id = blogs.id')
				.where('followings.created_at > ?', 1.week.ago)
				.order('blogs.followers_count DESC')
				.limit(5)	
	end
	
		# most popular all-time
	def self.most_popular
		Blog.joins('LEFT JOIN followings ON followings.blog_id = blogs.id')
				.order('blogs.followers_count DESC')
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

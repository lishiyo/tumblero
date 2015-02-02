class Post < ActiveRecord::Base
	include PgSearch
	include Likeable
	include Taggable
	
	multisearchable :against => :tags_string
# 	pg_search_scope :search_by_tags, :against => :tags_string
	
	pg_search_scope :search_by_tags, :associated_against => {
		:taggings => :name
  }
	
	belongs_to :blog, counter_cache: true
	has_one :user, through: :blog, source: :user
	
	# each source post gets a row in the table when reblogged
	has_many :reblogs, class_name: "Reblog", foreign_key: :post_id, inverse_of: :post, dependent: :destroy
	has_many :reblogging_blogs, through: :reblogs, source: :blog
	# source post is where :reblogged => false
	belongs_to :source_post, class_name: "Post", foreign_key: :source_id, primary_key: :id
	# posts that reblogged the source post
	has_many :reblogged_posts, class_name: "Post", foreign_key: :source_id, inverse_of: :source_post, dependent: :destroy
	has_many :liking_users, through: :likes, source: :user
	
	has_many :comments, inverse_of: :post, dependent: :destroy
	
	validates :content, presence: true, unless: ->(post){ post.filepicker_urls.present? }
	validates :filepicker_urls, presence: true, unless: ->(post){ post.content.present? }
	validates :blog, presence: :true
	
	default_scope  { order(created_at: :desc) }
	scope :reblogged, -> { where(reblogged: true) }
	
	
	# HELPERS
	# reset comments back to 0
	def self.reset_comments
		Post.all.each do |p|
			Post.reset_counters(p.id, :comments)
		end
	end
	
	def self.reset_total_notes
		Post.all.each do |p|
			p.update!(total_notes: p.notes_count)
		end
	end
	
	# all users who like me
	def likers
		if self.reblogged
			source = Post.find(self.source_id)
			source.liking_users
		else
			self.liking_users
		end
	end
	
	def likers_ids
		likers.map(&:id)
	end
	
	def comments
		self.reblogged ? self.source_post.comments : Comment.where(post_id: self.id)
	end
	
	def comments_count
		self.reblogged ? self.source_post.comments_count : Post.where(id: self.id).pluck('comments_count').first
	end
	
	def self.created_before(time)
    where("created_at < ?", time)
 	end
	
	def self.created_after(time)
    where("created_at > ?", time)
 	end
	
	# ONE query - reblogs_count + likes_count + comments_count
	def notes_count
		if self.reblogged
			source_post.likes_count + source_post.reblogs_count + source_post.comments_count
		else
			reblogs_count + likes_count + comments_count
		end
	end
	
	# TRENDING
	
	# most popular all-time
	def self.most_popular
		Post.order('total_notes DESC').limit(10)
	end
	
	# posts created in last day with highest number of notes
# 	def self.trending
# 		self.created_after(1.day.ago).sort_by{|p| p.notes_count }.reverse
# 	end
	
	# new posts that gained the most notes in last timespan
	def self.trending_in(time)
		Post.where('created_at > ?', time).order('total_notes DESC').limit(10)
	end
	
	def recent_notes_count
		if self.reblogged
			Like.where('created_at > ?', 1.day.ago).where('likeable_type = ? AND likeable_id = ?', 'Post', source_post.id).size + Reblog.where('created_at > ? AND post_id = ?', 1.day.ago, source_post.id).size
		else
			Like.where('created_at > ?', 1.day.ago).where('likeable_type = ? AND likeable_id = ?', 'Post', self.id).size + Reblog.where('created_at > ? AND post_id = ?', 1.day.ago, self.id).size
		end
	end
	
	# create reblog association for the *source* post rather than self
	def create_reblog_for!(blog_id)
		# if you are a reblog, look at source post instead
		Post.transaction do
			if self.reblogged
				reblog = self.source_post.reblogs.build(blog_id: blog_id)
			else
				reblog = self.reblogs.build(blog_id: blog_id)
			end
			
			reblog.save!
			
			return true
		end
		
		false
	end
	
	# called on post create
	def create_new_taggings!(tagging_names, user)
		return unless tagging_names.length > 0
		
		Tagging.transaction do 
			tagging_names.each do |tagging_name|
				tagging = self.taggings.build(name: tagging_name, user_id: user.id)
				tagging.save!
			end
		end
	end
	
	# called on update of existing post
	def update_new_taggings(tagging_names, user)
		return unless tagging_names.length > 0
		
		old_names = self.taggings.map(&:name)
		new_names = tagging_names - old_names
		names_to_destroy = old_names - tagging_names
		
		# update taggings by deleting old and creating new
		Tagging.transaction do
			Tagging.where(taggable_type: "Post", taggable_id: self.id, name: names_to_destroy).destroy_all
			new_names.each do |new_name|
				tagging = self.taggings.build(name: new_name, user_id: user.id)
				tagging.save!
			end
		end
	end
	
	
end
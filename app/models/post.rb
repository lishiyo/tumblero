class Post < ActiveRecord::Base
	include Likeable
	include Taggable
	
	belongs_to :blog
	has_one :author, through: :blog, source: :user
	
	# each source post gets a row in the table when reblogged
	has_many :reblogs, class_name: "Reblog", foreign_key: :post_id, inverse_of: :post
	has_many :reblogging_blogs, through: :reblogs, source: :blog
	# source post is where :reblogged => false
	belongs_to :source_post, class_name: "Post", foreign_key: :source_id, primary_key: :id
	# posts that reblogged the source post
	has_many :reblogged_posts, class_name: "Post", foreign_key: :source_id, inverse_of: :source_post
	
	has_many :comments, inverse_of: :post, dependent: :destroy
	
	validates :content, presence: true, unless: ->(post){ post.filepicker_urls.present? }
	validates :filepicker_urls, presence: true, unless: ->(post){ post.content.present? }
	validates :blog, presence: :true
	
	default_scope  { order(created_at: :desc) }
	
	# { 0 => [1,2,3], 2 => [4,5,6] }
	def comments_by_parent
		comments_by_parent = Hash.new { |hash, key| hash[key] = [] }

		self.comments.includes(:user).each do |comment|
			comments_by_parent[comment.parent_comment_id] << comment
    end

    comments_by_parent
	end
	
	# create reblog association for the *source* post
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
	def update_new_taggings(tagging_names)
		return unless tagging_names.length > 0
		
		old_names = self.taggings.map(&:name)
		new_names = tagging_names - old_names
		names_to_destroy = old_names - tagging_names
		
		# update taggings by deleting old and creating new
		Tagging.transaction do
			Tagging.where(taggable_type: "Post", taggable_id: self.id, name: names_to_destroy).destroy_all
			new_names.each do |new_name|
				tagging = self.taggings.build(name: new_name, user_id: current_user.id)
				tagging.save!
			end
		end
		
	end
	
	def count_notes
		count_likes + count_reblogs
	end
	
	private

	# count your own reblogs if a source post, else count source's
	def count_reblogs
		if self.reblogged
			Reblog.where(post_id: self.source_id).count
		else
			reblogs.count
		end
	end
	
end

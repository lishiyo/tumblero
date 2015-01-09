class Post < ActiveRecord::Base
	include Likeable
	include Taggable
	
	belongs_to :blog
	has_one :author, through: :blog, source: :user
	
	# if you delete a post, it will disappear on its original blog but remain on the reblogging_blog (reblogs never destroyed)
	has_many :reblogs, class_name: "Reblog", foreign_key: :post_id, inverse_of: :post
	has_many :reblogging_blogs, through: :reblogs, source: :blog
	has_many :comments, inverse_of: :post, dependent: :destroy
	
	validates :content, presence: true, unless: ->(post){ post.filepicker_urls.present? }
	validates :filepicker_urls, presence: true, unless: ->(post){ post.content.present? }
	validates :blog, presence: :true
	
	# { 0 => [1,2,3], 2 => [4,5,6] }
	def comments_by_parent
		comments_by_parent = Hash.new { |hash, key| hash[key] = [] }

		self.comments.includes(:user).each do |comment|
			comments_by_parent[comment.parent_comment_id] << comment
    end

    comments_by_parent
	end
	
	def create_reblog_for!(blog_id)
		if self.reblogged 
			reblog = self.reblogs.build(blog_id: blog_id)
			reblog.save!
		end
	end
	
	# called on post create
	def create_new_taggings!(tagging_names, user)
		Tagging.transaction do 
			tagging_names.each do |tagging_name|
				tagging = self.taggings.build(name: tagging_name, user_id: user.id)
				tagging.save!
			end
		end
	end
	
	# called on update of existing post
	def update_new_taggings(tagging_names)
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

	def count_reblogs
		reblogs.count
	end
	
end

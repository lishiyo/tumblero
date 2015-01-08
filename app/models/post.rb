class Post < ActiveRecord::Base
	
	belongs_to :blog
	has_one :author, through: :blog, source: :user
	has_many :likes, as: :likeable, dependent: :destroy
	
	# if you delete a post, it will disappear on its original blog but remain on the reblogging_blog (reblogs never destroyed)
	has_many :reblogs, class_name: "Reblog", foreign_key: :post_id, inverse_of: :post
	has_many :reblogging_blogs, through: :reblogs, source: :blog
	
	validates :content, presence: true, unless: ->(post){ post.filepicker_urls.present? }
	validates :filepicker_urls, presence: true, unless: ->(post){ post.content.present? }
	validates :blog, presence: :true
	
	has_many :comments, inverse_of: :post, dependent: :destroy
	
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
	
	def count_notes
		count_likes + count_reblogs
	end
	
	private
	
	def count_likes
		likes.count
	end
	
	def count_reblogs
		reblogs.count
	end
	
end

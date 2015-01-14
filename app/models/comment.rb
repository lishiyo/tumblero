class Comment < ActiveRecord::Base
	include Likeable
	
	validates :body, :user, :post_id, presence: true

  belongs_to :post, inverse_of: :comments, counter_cache: true
	belongs_to :user, inverse_of: :comments, counter_cache: true

  has_many :child_comments, class_name: "Comment", foreign_key: :parent_comment_id, primary_key: :id

  belongs_to :parent_comment, class_name: "Comment", foreign_key: :parent_comment_id, primary_key: :id
	
	has_many :liking_users, through: :likes, source: :user
	
  
	# class method to lookup all comments for a user
  scope :find_comments_by_user, lambda { |user|
    where(user_id: user.id).order('created_at DESC') }
	
	scope :find_comments_for_post, lambda { |post| 
		where(post_id: post.id).order('created_at DESC') }
	
	def main_blog_id
		user.main_blog_id
	end
	
	def main_blog_handle
		Blog.find(user.main_blog_id).handle
	end
	
	def ordered_child_comments
		child_comments.sort_by{|comm| comm.created_at }
	end
	
	def likers_ids
		liking_users.map(&:id)
	end
	
end

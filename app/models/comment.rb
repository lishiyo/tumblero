class Comment < ActiveRecord::Base
	validates :body, :user, :post, presence: true

  belongs_to :post, inverse_of: :comments
	belongs_to :user, inverse_of: :comments

  has_many :child_comments, class_name: "Comment", foreign_key: :parent_comment_id, primary_key: :id

  belongs_to :parent_comment, class_name: "Comment", foreign_key: :parent_comment_id, primary_key: :id
  
	# class method to lookup all comments for a user
  scope :find_comments_by_user, lambda { |user|
    where(user_id: user.id).order('created_at DESC') }
	
	scope :find_comments_for_post, lambda { |post| 
		where(post_id: post.id).order('created_at DESC') }
	
	def ordered_child_comments
		child_comments.sort_by{|comm| comm.created_at }
	end
	
end

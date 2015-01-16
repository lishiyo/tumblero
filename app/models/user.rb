class User < ActiveRecord::Base
  attr_reader :password
	validates :email, :password_digest, :session_token, presence: true
	validates :email, uniqueness: true
  validates :password, length: { minimum: 6, allow_nil: true }

	has_many :blogs, inverse_of: :user, dependent: :destroy
	
	has_many :posts, through: :blogs
	has_one :dashboard, inverse_of: :user, dependent: :destroy
	has_many :followings, dependent: :destroy
	has_many :followed_blogs, through: :followings, source: :blog, dependent: :destroy
	has_many :total_followers, through: :followed_blogs, source: :followers
	
	has_many :likings, class_name: "Like", foreign_key: :user_id, inverse_of: :user
	has_many :liked_posts, through: :likings, source: :likeable, source_type: 'Post'
	has_many :liked_comments, through: :likings, source: :likeable, source_type: 'Comment'
	
	has_many :comments, inverse_of: :user
	has_many :taggings, inverse_of: :user

	has_many :notifications, foreign_key: :user_id, inverse_of: :user
	has_many :notes, class_name: "Notification", foreign_key: :noter_id, inverse_of: :noter
# 	has_many :notifiers, through: :notifications, source: :noter
		
	after_initialize :ensure_session_token
	
	# HELPERS - reset blogs to first blog
	def self.reset_all
		User.all.each do |user|
			blog = user.blogs.first
			user.update!(main_blog_id: blog.id)
		end
	end
	
	def self.reset_notifications
		User.all.each do |u|
			User.reset_counters(u.id, :notifications)
		end
	end
	
	def main_blog
		Blog.find(self.main_blog_id)
	end
	
	# NOTIFICATIONS
	# params = user_id/noter_id, notification_type, notification_id
	def notify(params)
		notification = self.notes.create!(params)
		notification
	end
	
	def get_notified(params)
		notification = self.notifications.create!(params)
		notification
	end
	
	# TOGGLEABLE
	
	def follows?(blog)
		self.followed_blogs.include?(blog)
	end
	
	# include post and all its reblogged posts
	def all_liked_posts
		posts = []
		self.liked_posts.each do |post|
			posts << post.id
			if !post.reblogged # soruce post
				post.reblogged_posts.each {|r| posts << r.id } 
			end
		end
			
		posts.uniq
	end
	
	def likes?(likeable)
		if likeable.class == Post
			self.liked_posts.include?(likeable)	
		elsif likeable.class == Comment
			self.liked_comments.include?(likeable)
		end
	end
	
	def liked_posts_ids
		all_liked_posts
# 		self.liked_posts.map(&:id)
	end
	
	def liked_comments_ids
		self.liked_comments.map(&:id)
	end
	
	def followed_blogs_ids
		self.followed_blogs.map(&:id)
	end

	
	# USER AUTH
  def self.generate_session_token
    SecureRandom.urlsafe_base64
  end

  def reset_session_token!
    self.session_token = User.generate_session_token
    self.save!

    self.session_token
  end

	def self.find_by_credentials(email, password)
		user = User.find_by(email: email)
    return nil unless user
		user.is_password?(password) ? user : nil
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end
	
	
  private

  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end
	
end

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
	
	# GUEST ACCOUNTS
	
	# create one new guest blog for each guest
	def create_guest_blog_with_posts!				
		title = CoolFaker::Team.name.downcase.split(" ")
		blog = self.blogs.create!(
			name: title.join(" ").titleize, 
			handle: title.join("-"), 
			avatar_url: "https://www.filepicker.io/api/file/AEZhGspGTDC4q8MKBawA",
			description: "a totally kickass blog",
			guest: true)

		self.ensure_main_blog!(blog.id)
		blog.create_guest_posts!
		
		blog
	end	
	
	
	# BLOGS
	
	# created for first blog
	def ensure_main_blog!(blog_id)
		return unless self.main_blog_id.nil?
		
		self.main_blog_id = blog_id
		self.save!
	end
	
	def main_blog
		Blog.find(self.main_blog_id)
	end
	
	def blog_ids
		Blog.where(user_id: self.id).pluck('id')
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
	
	def likes?(likeable)
		if likeable.class == Post
			self.liked_posts.include?(likeable)	
		elsif likeable.class == Comment
			self.liked_comments.include?(likeable)
		end
	end
	
	def liked_posts_ids
		User.find(self.id).liked_posts.pluck('id')
	end
	
	# liked post and all its reblogs
	def all_liked_posts
		posts = []
		self.liked_posts.each do |post|
			posts << post.id
			if !post.reblogged # a source post
				post.reblogged_posts.each {|r| posts << r.id } 
			end
		end
			
		posts.uniq
	end
	
	def liked_comments_ids
		User.find(self.id).liked_comments.pluck('id')
	end
	
	def followed_blogs_ids
		User.find(self.id).followed_blogs.pluck('id')
	end
	
	# USER AUTH
	
	def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end
	
	def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end
	
	def reset_session_token!
    self.session_token = User.generate_session_token
    self.save!

    self.session_token
  end
	
	def self.generate_session_token
    SecureRandom.urlsafe_base64
  end 

	def self.find_by_credentials(email, password)
		user = User.find_by(email: email)
    return nil unless user
		user.is_password?(password) ? user : nil
  end
	
  private

  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end
	
end

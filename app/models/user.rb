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

	after_initialize :ensure_session_token
	
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
	
	def follows?(blog)
		self.followed_blogs.include?(blog)
	end
	
	def likes?(likeable)
		if likeable.class == Post
			self.liked_posts.include?(likeable)	
		end
	end
	
	def liked_posts_ids
		self.liked_posts.map(&:id)
	end
	
	def liked_comments_ids
		self.liked_comments.map(&:id)
	end
	
	def followed_blogs_ids
		self.followed_blogs.map(&:id)
	end

  private

  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end
	
end

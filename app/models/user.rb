class User < ActiveRecord::Base
  attr_reader :password
	validates :email, :password_digest, :session_token, presence: true
  validates :password, length: { minimum: 6, allow_nil: true }

  after_initialize :ensure_session_token
	
	has_many :blogs, inverse_of: :user
	has_many :posts, through: :blogs
	has_one :dashboard, inverse_of: :user
	has_many :followings
	has_many :followed_blogs, through: :followings, source: :blog

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

class Blog < ActiveRecord::Base
	
	belongs_to :user
	has_many :posts, inverse_of: :blog
	has_many :followings, dependent: :destroy
	has_many :followers, through: :followings, source: :user
	
	validates :name, presence: true, uniqueness: true
	validates :user, presence: :true
	validates :description, length: { maximum: 140 }
	
end

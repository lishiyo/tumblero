class Notification < ActiveRecord::Base
	# any like, reblog, comment, or follow 
	belongs_to :user, counter_cache: true
	belongs_to :noter, class_name: "User", foreign_key: :noter_id, counter_cache: true
	
	validates :user_id, :noter_id, :notification_type, :notification_id, presence: true
	
	# returns string
	def content
		case notification_type
		when "Reblog"
			"reblogged"
		when "Like"
			"liked"
		when "Comment" # only for posts 
			"commented on your post"
		when "Follow"
			"is following you"
		else
			"you got a notification"
		end
	end
	
end

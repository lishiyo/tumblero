class Notification < ActiveRecord::Base
	# any like, reblog, comment, or follow 
	belongs_to :user, counter_cache: true
	belongs_to :noter, class_name: "User", foreign_key: :noter_id
	
	validates :user_id, :noter_id, :notification_type, :notification_id, presence: true
	
	default_scope  { order(created_at: :desc) }
	
	
	# AS NOTIFICATION
	
	def content
		case notification_type
		when "Reblog"
			"reblogged your post"
		when "Like"
			"liked your post"
		when "Comment" # only for posts 
			"commented on your post"
		when "Following"
			"is now following you"
		else
			"New Notification!"
		end
	end
	
	# blog of the noter following me
	def noter_blog_url
		"blogs/#{self.noter.main_blog_id}"
	end
	
	# name of the main blog of the noter following me
	def noter_blog_handle
		noter.main_blog.handle
	end
	
	# AS NOTER
	
	def noter_content
		case notification_type
		when "Reblog"
			"<a href='#/posts/#{self.notification_id}'>" + "you reblogged a post" + "</a>"
		when "Like"
			"<a href='#/posts/#{self.notification_id}'>" + "you liked a post" + "</a>"
		when "Comment" # only for posts 
			"<a href='#/posts/#{self.notification_id}'>" + "you commented on a post" + "</a>"
		when "Following"
			"you are now following <a href='#/blogs/" + self.notifiable_url + "'>" + Blog.find(self.notification_id).handle + "</a>"
		else
			"new activity"
		end
	end
	
	# what you reblogged, liked, commented etc
	def notifiable_url
		if ["Reblog", "Like", "Comment"].include?(self.notification_type)
			"posts/#{notification_id}"
		else
			"blogs/#{notification_id}"
		end
	end
end

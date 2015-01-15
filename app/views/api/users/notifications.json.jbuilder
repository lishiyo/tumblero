json.notifications @user.notifications do |n|
	json.partial! "api/users/notification", notification: n
end
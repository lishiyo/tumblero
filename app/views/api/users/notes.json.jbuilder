json.notes @user.notes do |n|
	json.partial! "api/users/note", note: n
end
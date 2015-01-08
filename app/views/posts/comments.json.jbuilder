json.extract! @post, :id

json.comments_by_parent do
	@post.comments_by_parent.each do |comm, array|
		json.set!(comm, array)
	end
end

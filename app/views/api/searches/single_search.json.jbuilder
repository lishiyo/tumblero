json._page @search_results.current_page
json.total_pages @search_results.total_pages

json.results @search_results do |model|
	if model.class == Post
		json.partial! 'api/posts/post', post: model
	elsif model.class == Blog
		json.partial! "api/blogs/blog", blog: model
	end
end


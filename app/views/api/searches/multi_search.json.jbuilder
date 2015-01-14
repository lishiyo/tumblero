json._page @search_results.current_page
json.total_pages @search_results.total_pages

json.results @search_results.map(&:searchable) do |model|
  if model.class == Blog
    json.partial! "api/blogs/blog", blog: model
  else
    json.partial! "api/posts/post", post: model
  end
end

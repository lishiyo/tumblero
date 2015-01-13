json.page @search_results.current_page

json.results @search_results.map(&:searchable) do |model|
  if model.class == User
    json.partial! "api/users/user", user: model
  else
    json.partial! "api/posts/post", post: model
  end
end

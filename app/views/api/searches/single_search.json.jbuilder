json._page @search_results.current_page
json.total_pages @search_results.total_pages

json.results @search_results, partial: 'api/posts/post', as: :post


Rails.application.routes.draw do
	
	namespace 'api', defaults: { format: :json } do
		
		resources :users, only: [:new, :create, :show, :update, :destroy] do
			member do
				get 'notifications'
				get 'notes'
			end
		end
		
		resources :blogs, only: [:new, :create, :show, :index, :update] do 
			resources :posts, only: [:index]
			resource :following, only: [:create, :destroy]
			resources :taggings, only: [:index] 
			member do
				get 'submit'
				post 'submit'
				get 'all_posts'
				get 'search'
				get 'tags'
			end
		end
		
		resources :posts, only: [:new, :show, :create, :update, :destroy] do
			resources :comments, only: [:new]
			resources :taggings, only: [:index]
			member do
				post 'reblog'
				get 'comments'
			end
		end
		
		
		resource :dashboard, only: [:show] do
			resources :taggings, only: [:index]
			member do
				get 'posts'
				get 'tags'
			end			
		end
		
		resource :like, only: [:create, :destroy] 
		resources :comments, only: [:create, :show, :destroy]
		resources :taggings, only: [:create, :show, :destroy]
		
		get "guest_signup", to: "users#create_guest"
		get "explore/blogs", to: "blogs#index"
		get "search", to: "searches#index"
		get "search/blogs", to: "searches#blogs"
		get "search/posts", to: "searches#posts"
		get "search/all", to: "searches#all"
		get "tags/all", to: "taggings#all"
		get "dashboard/:id", to: "dashboards#show"
	end
	
	root to: "static_pages#index"
	resource :session, only: [:new, :create, :destroy]
	
end

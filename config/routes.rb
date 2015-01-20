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
			resources :taggings, only: [:index] # /api/blogs/:blog_id/taggings
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
			resources :taggings, only: [:index] # /api/dashboard/taggings
			member do
				get 'posts'
				get 'tags'
			end			
		end
		
		resource :like, only: [:create, :destroy] 
		resources :comments, only: [:create, :show, :destroy]
		resources :taggings, only: [:create, :show, :destroy]
		
		get "explore/blogs", to: "blogs#index"
		get "search", to: "searches#index"
		get "search/blogs", to: "searches#blogs"
		get "search/posts", to: "searches#posts"
		get "search/all", to: "searches#all"
		get "tags/all", to: "taggings#all"
	end
	
	root to: "static_pages#index"
	resource :session, only: [:new, :create, :destroy]
	
	# NOT NAMESPACE
	
# 	resources :static_pages, only: [:index]
	
	resources :blogs, only: [:new, :create, :show] do 
# 		resources :posts, only: [:index]
# 		resource :following, only: [:create, :destroy]
	end
	
# 	resources :posts, only: [:new, :show, :create] do
# 		resources :comments, only: [:new]
# 		member do
# 			get 'reblog'
# 			get 'comments'
# 		end
# 	end
	
# 	resource :dashboard, only: [:show]
# 	resource :like, only: [:create, :destroy] 
# 	resources :comments, only: [:create, :show, :destroy]
	
# 	get 'explore/blogs', to: 'blogs#index'
	
	
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end

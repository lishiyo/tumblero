class Api::DashboardsController < ApplicationController
	
	before_action :require_logged_in
	
	def show
		@dashboard = current_user.dashboard
		render json: @dashboard.as_json(:include => { posts: { methods: :count_notes }})	
	end
	
end

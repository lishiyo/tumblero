class DashboardsController < ApplicationController
	
	before_action :require_logged_in
	
	def show
		@dashboard = current_user.dashboard
	end
	
end

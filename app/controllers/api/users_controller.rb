class Api::UsersController < ApplicationController

  wrap_parameters false
	
	before_action :require_logged_in, only: [:show, :edit, :update, :destroy]
	before_action :set_user, only: [:show, :destroy, :notifications, :notes]
	
  def new
    @user = User.new
    render json: @user
  end
	
	def create_guest
		old_guest = User.find_by(email: "guest@tumblero.com")
		custom_params = { email: "guest@tumblero.com", password: "demodemo" }
		
		User.transaction do
			old_guest.destroy!
			@user = User.new(custom_params)
			@user.create_dashboard
		end
		
		if @user.save
      log_in!(@user)
			@user.create_guest_blog!
      render json: @user
    else
      render json: @user.errors.full_messages, status: 422
    end
		
	end

  def create
		User.transaction do
			@user = User.new(user_params)
			@user.create_dashboard
		end
    
    if @user.save
      log_in!(@user)
      render json: @user
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def show
		@notifications = @user.notifications.limit(5)
		@notes = @user.notes.limit(5)
		render :show
  end
	
	def update
		if user_params[:old_password]
			@user = User.find_by_credentials(current_user.email, user_params[:old_password])
		else
			@user = current_user
		end
		
		if @user && @user == current_user
			@user.update(user_params.except(:old_password))
			render json: @user.as_json(include: [:liked_posts, :blogs])
		else
			render json: @user.errors.full_messages, status: 422
		end
	end
	
	def destroy
		@user.destroy!
		render json: nil
	end
	
	def notifications
		@notifications = @user.notifications.limit(5)
		render :notifications
	end
	
	def notes
		@notes = @user.notifications.limit(5)
		render :notes
	end
	
	# GET /dashboard
	def dashboard
	end

  private
	
	def set_user
		@user = User.find(params[:id])
	end
	
  def user_params
		params.require(:user).permit(:email, :password, :old_password)
  end
	
end

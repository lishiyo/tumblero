class Api::UsersController < ApplicationController

  wrap_parameters false
	
	before_action :require_logged_in, only: [:show, :edit, :update, :destroy]
	before_action :set_user, only: [:show, :destroy, :notifications, :notes]
	
  def new
    @user = User.new
    render json: @user
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
		render :notifications
	end
	
	def notes
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

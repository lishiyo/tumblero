class Api::UsersController < ApplicationController

  wrap_parameters false
	
	before_action :require_logged_in, only: [:show, :edit, :update, :destroy]
# 	before_action :set_user, only: [:show, :edit, :update, :destroy]
	
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
		@user = current_user
# 		render :show
#     render json: @user
  end
	
	def edit
		
	end
	
	def update
		
	end
	
	def destroy
		
	end
	
	# GET /dashboard
	def dashboard
		
	end

  private
	
	def set_user
		@user = User.find(params[:id])
	end
	
  def user_params
		params.require(:user).permit(:email, :password)
  end
	
end

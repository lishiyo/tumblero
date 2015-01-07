class SessionsController < ApplicationController

  wrap_parameters false

  def new
    @user = User.new
    render json: @user
  end

  def create
		@user = User.find_by_credentials(user_params[:email], user_params[:password])
    if @user
      log_in!(@user)
      render json: @user
    else
			render json: ["wrong credentials"], status: 422
    end
  end

  def destroy
    log_out!
		redirect_to root_url
  end

  private
	
  def user_params
		params.require(:user).permit(:email, :password)
  end
end

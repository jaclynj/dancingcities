class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user #makes this method available in our views as wells

  private

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    #this makes the currently logged in user accessible
  end
end

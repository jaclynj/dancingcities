class SessionsController < ApplicationController

  def create
    auth = request.env["omniauth.auth"]
    #this is for twitter authentication. to see what info this sends, you can do
    # raise request.env["omniauth.auth"].to_yaml
    user = User.find_by_provider_and_uid(auth["provider"], auth["uid"]) || User.create_with_omniauth(auth)
    #the code above finds user in our database if it exists, OR creates user in our db using omniauth using a method defined in the User model
    session[:user_id] = user.id
    redirect_to root_url, :notice => "Signed in!"
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, :notice => "Signed out!"
  end

end

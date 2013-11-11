class AdminSessionsController < ApplicationController

  def new

  end

  def create
    admin = Admin.authenticate(params[:admin_name], params[:password])
    if admin
      session[:admin_id] = admin.id
      redirect_to '/admins', :notice => "Logged in as Administrator"
    else
      flash.now.alert = "Invalid Administrator Login"
      render "new"
    end
  end

  def destroy
    session[:admin_id] = nil
    redirect_to '/admins', :notice => "logged out from administrator panel!"
  end
end

class MessagesController < ApplicationController

  # AJAX CHEATSHEET (These have been tested to work) :
  # to get messages:
  # $.ajax({
  #   type: "GET",
  #   url: '/messages.json'
  # })
  #
  # to create message:
  # $.ajax({
  #   type: "POST",
  #   data: {message: {message: "hi"}},
  #   url: '/messages.json'
  # })
  #
  # to delete message:
  # $.ajax({
  #   type: "DELETE",
  #   url: '/messages/2.json'
  # })

#BEGIN CODE

  # GET '/messages.json'
  def index
    @messages = Message.all
    respond_to do |format|
      format.json { render json: @messages }
    end
  end

  # GET '/messages/new.json'
  def new
    @new_message = {
      message: nil
      }
    respond_to do |format|
      format.json { render json: @new_message }
    end
  end

    # POST '/messages.json'
  def create
    @new_message = Message.create(params[:message])
    respond_to do |format|
      if @new_message.save
          format.json { render json: @new_message, status: :created, location: @message }
      else
        format.json { render json: @new_message.errors, status: :unprocessable_entity }
      end
    end
  end

  # GET '/messages/:id.json'
  def show
    @message = Message.find_by_id(params[:id])
    respond_to do |format|
      format.json {render json: @message}
      format.html
    end
  end

  def delete

  end

  def destroy
    @message = Message.find_by_id(params[:id])
    @message.destroy
    respond_to do |format|
      format.html {redirect_to admins_path}
      format.json {redirect_to :root}
    end
  end

end

require 'open-uri'

class ImageController < ApplicationController
  def convert
    # binding.pry
    image_url = params[:image_url]
    image_file= open(image_url, "rb").read
    image = Base64.encode64(image_file)
    send_data image, :type => 'image/png;base64', :disposition => 'inline'
  end
end
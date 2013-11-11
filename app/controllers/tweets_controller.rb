class TweetsController < ApplicationController

  def index
    #sends an API request to return 15 tweets with search of #NYC and within 7 miles of GA East
    @tweets = Twitter.search('%23NYC', options = {geocode: "40.739535,-73.989662,7mi"}).results.map do |status|
      status.text
    end
    respond_to do |format|
      format.html
      format.json { render json: @tweets }
    end
  end

end
class TweetsController < ApplicationController

  def index
    # tweets by hashtag first
    @tweets = Twitter.search('#dancingcities', options = {count: 20}).results.map do |status|
    status.text
  end

    #sends an API request to return 15 tweets with search of #NYC and within 7 miles of GA East
    @tweets += Twitter.search('', options = {geocode: "40.739535,-73.989662,7mi", count: 20}).results.map do |status|
      status.text
    end
    respond_to do |format|
      format.html
      format.json { render json: @tweets }
    end
  end

end

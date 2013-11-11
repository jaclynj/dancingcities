class WelcomeController < ApplicationController

  def index
    @tweets = Twitter.search('%23NYC').results.map do |status|
      status.text
    end
  end

end

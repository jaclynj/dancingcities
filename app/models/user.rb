class User < ActiveRecord::Base
  attr_accessible :name, :provider, :uid

#this method creates user in our users table, using the twitter sign-in info
  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth["provider"] #twitter
      user.uid = auth["uid"] #their user ID
      user.name = auth["info"]["name"] #their name on twitter
    end
  end

end

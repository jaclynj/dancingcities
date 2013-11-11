DancingCityApp::Application.routes.draw do

root to: 'welcome#index'

resources :messages

#below is for twitter authentication
match '/auth/twitter/callback' => 'sessions#create'
match '/signout' => "sessions#destroy", :as => :signout
match '/checker' => "sessions#checker"
end

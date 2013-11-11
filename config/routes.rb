DancingCityApp::Application.routes.draw do

root to: 'welcome#index'

resources :messages

#below is for twitter authentication
match '/auth/twitter/callback' => 'sessions#create'

end

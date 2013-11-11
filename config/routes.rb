DancingCityApp::Application.routes.draw do

  root to: 'welcome#index'

  resources :messages
  resources :tweets
  resources :admins
  resources :admin_sessions

  get "admin_login" => "admin_sessions#new", :as => "admin_login"
  get "admin_logout" => "admin_sessions#destroy", :as => "admin_logout"


  #below is for twitter authentication
  match '/auth/twitter/callback' => 'sessions#create'
  match '/signout' => "sessions#destroy", :as => :signout
  match '/checker' => "sessions#checker"
  match '/current_user' => "sessions#current_user"
end

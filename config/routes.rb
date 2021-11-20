# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root 'application#index'

  namespace :api do
    namespace :v1 do
      resources :fshare, only: [] do
        member do
          get :play
          get :download
          get :list
        end
      end
    end
  end
end

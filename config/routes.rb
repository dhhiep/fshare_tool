# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'activities#index'

  resources :activities, only: %i[index]

  namespace :api do
    namespace :v1 do
      resources :health_check, only: %i[index], path: 'health-check'
      resources :fshare, only: [] do
        member do
          get :play
          get :lan_link, path: 'lan-link'
          get :direct_link, path: 'direct-link'
          get :list
          get :list_v3
        end
      end
    end
  end
end

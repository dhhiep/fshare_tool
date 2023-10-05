# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'activities#index'

  match '/delayed-job' => DelayedJobWeb, :anchor => false, :via => %i[get post]

  resources :activities, only: %i[index destroy] do
    collection do
      delete :destroy_all, path: 'destroy-all'
    end
  end

  resources :rclone_transfers, only: %i[index destroy], path: :transfers do
    member do
      post :retransfer
    end
  end

  resources :playbacks, only: %i[index destroy]

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

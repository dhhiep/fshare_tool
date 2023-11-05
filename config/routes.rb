# frozen_string_literal: true

Rails.application.routes.draw do # rubocop:disable Metrics/BlockLength
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'activities#index'

  match '/jobs' => DelayedJobWeb, :anchor => false, :via => %i[get post]

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

      resources :rclone, only: [] do
        collection do
          get :remotes
          get :directories
        end
      end

      resources :fshare, only: [] do
        collection do
          scope :transfer do
            post :file, action: :transfer_file
          end
        end

        member do
          get :play
          get :direct_link, path: 'direct-link'
          get :list
          get :list_v3
        end
      end
    end
  end
end

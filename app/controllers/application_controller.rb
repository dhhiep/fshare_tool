# frozen_string_literal: true

class ApplicationController < ActionController::API
  def index
    render json: { message: 'Welcome to Fshare Tool' }, status: :ok
  end
end

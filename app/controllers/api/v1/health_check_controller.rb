# frozen_string_literal: true

module Api
  module V1
    class HealthCheckController < BaseController
      def index
        render json: { message: 'Welcome to Fshare Tool' }
      end
    end
  end
end

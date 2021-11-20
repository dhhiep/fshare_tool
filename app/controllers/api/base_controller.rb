# frozen_string_literal: true

module Api
  class BaseController < ApplicationController
    include Error::ExceptionErrorBuilder

    rescue_from Error::GatewayError, with: :gateway_error

    private

    def gateway_error(exception)
      render_error_payload(exception.message)
    end

    def render_error_payload(error, status = 422)
      if error.is_a?(Struct)
        render json: { error: error.to_s, errors: error.to_h }, status: status, content_type: content_type
      elsif error.is_a?(String)
        render json: error, status: status, content_type: content_type
      end
    end
  end
end

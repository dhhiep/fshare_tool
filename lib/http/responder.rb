# frozen_string_literal: true

require 'httparty'

module Http
  class Responder
    attr_reader :response

    def initialize(response)
      @response = response.is_a?(Hash) ? OpenStruct.new(response) : response
    end

    def code
      response.code
    end

    def body
      body_parser
    end

    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    def success?
      response.code.to_i.between?(200, 299)
    end

    def redirect?
      response.code.to_i.between?(300, 399)
    end

    def failure?
      response.code.to_i.between?(400, 599)
    end

    def to_h
      { code: code, body: body }
    end

    private

    def body_parser
      response.to_h.deep_symbolize_keys
    rescue
      response
    end
  end
end

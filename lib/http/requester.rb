# frozen_string_literal: true

module Http
  class Requester
    def self.make_request(http_verb, url, body = {}, options = {})
      new(http_verb, url, body, options).make_request
    end

    def initialize(http_verb, url, body = {}, options = {})
      @http_verb = http_verb
      @url = url
      @body = body
      @options = options
    end

    def make_request
      response =
        Http::Exceptions.wrap_and_check do
          HTTParty.send(http_verb, url, request_params)
        end

      Responder.new(response, request_params: request_params)
    rescue Http::Exceptions::HttpException => e
      responder =
        if e.respond_to?(:response) && !e.response&.body.nil? && !e.response&.body&.empty?
          Responder.new(e.response, request_params: request_params)
        else
          Responder.new({ code: 503, body: { message: e.to_s } }, request_params: request_params)
        end

      capture_error(responder)
    rescue StandardError => e
      responder = Responder.new({ code: 500, body: { message: e.to_s } }, request_params: request_params)

      capture_error(responder)
    end

    private

    attr_reader :http_verb, :url, :body, :options

    def default_headers
      { 'Content-Type' => 'application/json' }
    end

    def headers
      default_headers.merge(options[:headers] || {})
    end

    def request_timeout
      (options[:timeout].presence || 30).to_i
    end

    def request_params
      @request_params ||= build_params_headers
    end

    def build_params_headers
      base_params = {
        headers: headers,
        timeout: request_timeout,
      }

      return base_params if body.blank?

      base_params[:body] = body.to_json if %w[post put patch delete].include?(http_verb.to_s)
      base_params[:query] = body.to_h if %w[get].include?(http_verb.to_s)
      base_params
    end

    def capture_error(response)
      label = options[:label].present? ? "[#{options[:label].to_s.upcase}]" : ''

      Rails.logger.error("\n#{label} #{http_verb.upcase} #{url} #{build_params_headers}: #{response.to_h}\n")
      response
    end
  end
end

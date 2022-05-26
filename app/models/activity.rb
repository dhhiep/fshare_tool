# frozen_string_literal: true

class Activity < ApplicationRecord
  ACTIONS = %i[
    play
    shared_link
    direct_link
    list
    list_v3
  ].freeze

  FILE_TYPES = %i[
    folder
    subtitle
    video
    file
  ].freeze

  before_validation :set_file_type

  class << self
    def track_response(type, response)
      return if Activity::ACTIONS.exclude?(type)

      request_data = parse_request_data(response)
      activity_data = {
        action: type,
        url: request_data[:url],
        file_name: extract_name(type, response),
        file_ext: extract_file_ext(type, response),
      }

      create(activity_data)
    end

    private

    def extract_name(type, response)
      case type
      when :list
        response.body&.first&.dig('path')&.split('/')&.last
      when :list_v3
        response.body&.dig(:current, :name)
      when :play, :shared_link, :direct_link
        CGI.unescape(response.body&.dig(:location).to_s.split('/').last)
      else
        'Unknown'
      end
    end

    def extract_file_ext(type, response)
      case type
      when :list, :list_v3
        ''
      when :play, :shared_link, :direct_link
        response.body&.dig(:location).to_s.split('.').last.to_s.downcase
      else
        'Unknown'
      end
    end

    def parse_request_data(response)
      data = response.request_params[:body].presence || response.request_params[:query].presence || {}
      data = JSON.parse(data).symbolize_keys if data.is_a?(String)
      data
    end
  end

  private

  def set_file_type
    self.file_type =
      if file_ext.blank?
        'folder'
      elsif Vlc::Player::SUBTITLE_EXTENSIONS.include?(file_ext)
        'subtitle'
      elsif Vlc::Player::VIDEO_EXTENSIONS.include?(file_ext)
        'video'
      else
        'file'
      end
  end
end

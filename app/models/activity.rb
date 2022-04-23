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
      direct_url = response.body[:location]
      activity_data = {
        action: type,
        url: request_data[:url],
        file_name: direct_url.to_s.split('/').last,
        file_ext: direct_url.to_s.split('.').last.to_s.downcase,
      }

      create(activity_data)
    end

    private

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
      elsif Vlc::SUBTITLE_EXTENSIONS.include?(file_ext)
        'subtitle'
      elsif Vlc::VIDEO_EXTENSIONS.include?(file_ext)
        'video'
      else
        'file'
      end
  end
end

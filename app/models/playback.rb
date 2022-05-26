# frozen_string_literal: true

class Playback < ApplicationRecord
  before_validation :unescape_file_name
  before_validation :set_file_name_signature

  class << self
    def resume(file_name)
      video_playback = find_by(file_name_signature: create_signature(file_name))
      return if video_playback.blank? || video_playback.current_time.zero?

      vlc_rc = Vlc::RemoteControl.new
      Retryable.retryable(tries: 5, sleep: 1) do
        vlc_rc.seek(video_playback.current_time)
      end
    rescue => e
      puts "Playback.resume failure: #{e.message}"
    end

    def add(file_name, link_code)
      return if file_name.blank? || link_code.blank?

      video_playback = find_or_initialize_by(file_name_signature: create_signature(file_name))
      video_playback.update(file_name: file_name, url: "https://www.fshare.vn/file/#{link_code}")
    end

    def track(file_name, current_time, total_time)
      return if file_name.blank? || current_time.zero?
      return if current_time.to_i <= 60

      video_playback = find_or_initialize_by(file_name_signature: create_signature(file_name))
      video_playback.update(file_name: file_name, current_time: current_time, total_time: total_time)
      video_playback
    end

    def create_signature(data)
      return if data.blank?

      CGI.unescape(data.to_s).to_md5
    end
  end

  private

  def unescape_file_name
    self.file_name = CGI.unescape(file_name.to_s)
  end

  def set_file_name_signature
    return if file_name.blank?

    self.file_name_signature = Playback.create_signature(file_name)
  end
end

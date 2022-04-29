# frozen_string_literal: true

class Playback < ApplicationRecord
  class << self
    def resume(file_name)
      video_playback = find_by(file_name: file_name)
      return unless video_playback
      return if video_playback.current_time.zero?

      vlc_rc = Vlc::RemoteControl.new
      Retryable.retryable(tries: 5, sleep: 1) do
        vlc_rc.seek(video_playback.current_time)
      end
    rescue => e
      puts "Playback.resume failure: #{e.message}"
    end

    def add(file_name, link_code)
      return if file_name.blank? || link_code.blank?

      video_playback = find_or_initialize_by(file_name: file_name)
      video_playback.update(file_name: file_name, url: "https://www.fshare.vn/file/#{link_code}")
    end

    def track(file_name, current_time, total_time)
      return if file_name.blank? || current_time.zero? || total_time.zero?
      return if current_time.to_i <= 60

      video_playback = find_or_initialize_by(file_name: file_name)
      video_playback.update(current_time: current_time, total_time: total_time)
    end
  end
end

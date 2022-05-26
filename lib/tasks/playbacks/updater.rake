# frozen_string_literal: true

namespace :playbacks do
  # rake playbacks:updater
  task updater: :environment do
    vcl_rc = Vlc::RemoteControl.new
    file_name = vcl_rc&.file_name
    current_time = vcl_rc&.current_time
    total_time = vcl_rc&.total_time

    playback = Playback.track(file_name, current_time, total_time)
    if playback && playback.errors.blank?
      log_messages = [
        "Name: #{playback.file_name}",
        "Current: #{playback.current_time.display_in_hours}",
        "Total: #{playback.total_time.display_in_hours}",
      ]

      puts "[TASKS][playbacks:updater][SUCCESS] #{log_messages.join(' - ')}"
    else
      debug_data = [
        "Name: #{file_name}",
        "Current: #{current_time.display_in_hours}",
        "Total: #{total_time.display_in_hours}",
        "Errors: #{playback&.errors&.full_messages&.join(', ')}"
      ]
      puts "[TASKS][playbacks:updater][FAIL] #{debug_data.join(' - ')}"
    end
  end
end

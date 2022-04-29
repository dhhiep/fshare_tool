# frozen_string_literal: true

namespace :playbacks do
  # rake playbacks:updater
  task updater: :environment do
    vcl_rc = Vlc::RemoteControl.new
    file_name = vcl_rc.file_name
    current_time = vcl_rc.current_time
    total_time = vcl_rc.total_time

    result = Playback.track(file_name, current_time, total_time)
    status = result ? 'SUCCESS' : 'FAIL'

    log_messages = [
      "Name: #{file_name}",
      "Current: #{current_time.display_in_hours}",
      "Total: #{total_time.display_in_hours}",
    ]

    puts "[TASKS][playbacks:updater][#{status}] #{log_messages.join(' - ')}"
  end
end

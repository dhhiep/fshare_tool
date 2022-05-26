# frozen_string_literal: true

module Vlc
  class RemoteControl
    def file_name
      @file_name ||= CGI.unescape(original_file_name.to_s)
    end

    def original_file_name
      @original_file_name ||= send('info').match(/filename: (.*)\n/)
      return if @original_file_name.blank?

      @original_file_name[1]
    end

    def current_time
      send('get_time').to_i
    end

    def total_time
      send('get_length').to_i
    end

    def seek(time)
      send("seek #{time}")
    end

    private

    def send(command)
      vlc.puts(command)
      sleep(0.1)
      vlc.waitfor(/./).split('for help.').last.gsub("\n>\s", '')
    end

    def vlc
      @vlc ||= Net::Telnet.new('Host' => '127.0.0.1', 'Port' => 7744, 'Telnetmode' => false)
    end
  end
end

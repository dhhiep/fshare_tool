# frozen_string_literal: true

require 'open-uri'

class Vlc
  VIDEO_EXTENSIONS = %w[
    webm mkv flv flv vob ogv ogg drc gif gifv mng avi mts m2ts ts mov qt wmv yuv rm rmvb viv asf amv mp4 m4p m4v
    mpg mp2 mpeg mpe mpv mpg mpeg m2v m4v svi 3gp 3g2 mxf roq nsv flv f4v f4p f4a f4b
  ].freeze

  SUBTITLE_EXTENSIONS = %w[
    aqt ass cip pjs s2k sbv srt ssa sub txt zeg
  ].freeze

  class << self
    def fshare_play_or_add_subtitle(video_or_subtitle_id)
      fshare = Fshare.new
      fshare.login!
      response = fshare.direct_link(video_or_subtitle_id)
      direct_link_url = response.body[:location]

      if video?(direct_link_url)
        play_video(direct_link_url)
      elsif subtitle?(direct_link_url)
        add_subtitle(direct_link_url)
      else
        raise Error::GatewayError, { message: 'File extension invalid!', details: direct_link_url.to_s.split('/').last }
      end

      response
    rescue => e
      raise Error::GatewayError, { message: 'VLC play failure!', details: e.message }
    end

    private

    def video?(url)
      VIDEO_EXTENSIONS.include?(url.split('.').last.downcase)
    end

    def subtitle?(url)
      SUBTITLE_EXTENSIONS.include?(url.split('.').last.downcase)
    end

    def play_video(video_url)
      kill_vlc_instance!

      exec_command = "#{vcl_path} --fullscreen #{video_url}"
      fork { exec(exec_command) }
    end

    def add_subtitle(subtitle_url)
      subtitle_file_path = Down.download(subtitle_url)

      fork { exec("open -a '#{vcl_path}' #{subtitle_file_path.path}") }
    end

    def kill_vlc_instance!
      system("ps aux | grep VLC | awk '{print $2}' | xargs kill")
    end

    def vcl_path
      ENV.fetch('VLC_PATH')
    end
  end
end

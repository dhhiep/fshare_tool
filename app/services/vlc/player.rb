# frozen_string_literal: true

require 'open-uri'

module Vlc
  class Player
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

          # Initialize video playback
          file_name = direct_link_url.split('/').last
          Playback.add(file_name, video_or_subtitle_id)
          Playback.resume(file_name)
        else
          raise Error::GatewayError, "File extension invalid! #{direct_link_url.to_s.split('/').last}"
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
        Retryable.retryable(tries: 5, sleep: 0.5) do
          vlc_rc = Vlc::RemoteControl.new
          vlc_rc.play(video_url)
        rescue Errno::ECONNREFUSED
          raise Error::GatewayError, 'Please open VLC app first!'
        end
      end
    end
  end
end

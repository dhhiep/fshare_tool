# frozen_string_literal: true

module Api
  module V1
    class FshareController < BaseController
      def lan_link
        response = fshare.direct_link(params[:id])
        Activity.track_response(:shared_link, response) if response.success?

        render html: "<a href='#{response.body[:location]}'>Click here to Download</a>".html_safe
      end

      def direct_link
        response = fshare.direct_link(params[:id])
        Activity.track_response(:direct_link, response) if response.success?

        render json: response.body, code: response.code
      end

      def list
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 60).to_i
        response = fshare.list(params[:id], page: page, per_page: per_page)
        Activity.track_response(:list, response) if response.success?

        data = ::FshareFolderSerializer.call(response.body)
        render json: data, code: response.code
      end

      def list_v3
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 50).to_i
        options = { sort_by: 'type,name' }
        response = Fshare.new.list_v3(params[:id], page: page, per_page: per_page, options: options)
        Activity.track_response(:list_v3, response) if response.success?
        raise Error::GatewayError, { message: 'Fetch data failure!', details: response.to_h } if response.failure?

        data = ::FshareFolderV3Serializer.call(response.body)
        render json: data, code: response.code
      end

      def play
        response = Vlc.fshare_play_or_add_subtitle(params[:id])
        Activity.track_response(:play, response) if response.success?

        render json: { message: 'VLC playing ...' }, status: :ok
      end

      private

      def fshare
        return @fshare if @fshare

        @fshare = Fshare.new
        @fshare.login!
        @fshare
      end
    end
  end
end

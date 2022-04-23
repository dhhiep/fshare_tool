# frozen_string_literal: true

module Api
  module V1
    class FshareController < BaseController
      def direct_link
        result = fshare.direct_link(params[:id])

        render json: result.body, code: result.code
      end

      def list
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 60).to_i
        result = fshare.list(params[:id], page: page, per_page: per_page)

        data = ::FshareFolderSerializer.call(result.body)
        render json: data, code: result.code
      end

      def list_v3
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 50).to_i
        options = { sort_by: 'type,name' }
        result = Fshare.new.list_v3(params[:id], page: page, per_page: per_page, options: options)
        raise Error::GatewayError, { message: 'Fetch data failure!', details: result.to_h } if result.failure?

        data = ::FshareFolderV3Serializer.call(result.body)
        render json: data, code: result.code
      end

      def play
        Vlc.fshare_play_or_add_subtitle(params[:id])

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

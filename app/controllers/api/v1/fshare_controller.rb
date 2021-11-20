# frozen_string_literal: true

module Api
  module V1
    class FshareController < BaseController
      def download
        result = fshare.direct_link(params[:id])

        render json: result.body, code: result.code
      end

      def list
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 60).to_i
        result = fshare.list(params[:id], page: page, per_page: per_page)

        render json: result.body, code: result.code
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

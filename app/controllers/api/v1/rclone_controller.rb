# frozen_string_literal: true

module Api
  module V1
    class RcloneController < BaseController
      def remotes
        render json: Rclone.remotes, status: :ok
      end

      def directories
        result = Rclone.directories(params[:remote], params[:destination_path])

        render json: result, status: :ok
      end
    end
  end
end

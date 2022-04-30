# frozen_string_literal: true

class PlaybacksController < ApplicationController
  def index
    @q = Playback.ransack(params[:q])
    @playbacks = @q.result.order(updated_at: :desc).page(params[:page]).per(100)
  end

  def destroy
    playback = Playback.find(params[:id])
    playback.destroy

    redirect_to playbacks_path, notice: "Playback #{playback.file_name} was destroyed successfully!"
  end
end

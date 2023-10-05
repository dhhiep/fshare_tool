# frozen_string_literal: true

class RcloneTransfersController < ApplicationController
  def index
    @q = RcloneTransfer.ransack(params[:q])
    @rclone_transfers = @q.result.order(updated_at: :desc).page(params[:page]).per(20)
  end

  def retransfer
    transfer = RcloneTransfer.find(params[:id])
    message = "Transfer #{transfer.file_name} is #{status}"

    if transfer.finished? || transfer.stopped?
      Rclone.clone(transfer.file_id, transfer.remote, transfer.destination_path, { file_name: transfer.file_name })
      message = "Transfer #{transfer.file_name} was enqueued successfully!"
    end

    redirect_to rclone_transfers_path, notice: message
  end

  def destroy
    rclone_transfer = RcloneTransfer.find(params[:id])
    rclone_transfer.destroy

    redirect_to rclone_transfers_path, notice: "Transfer #{rclone_transfer.file_name} was destroyed successfully!"
  end
end

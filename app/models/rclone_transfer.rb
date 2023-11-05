# frozen_string_literal: true

# == Schema Information
#
# Table name: rclone_transfers
#
#  id               :integer          not null, primary key
#  destination_path :string
#  file_name        :string
#  progress         :string
#  remote           :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  file_id          :string
#  job_id           :integer
#

class RcloneTransfer < ApplicationRecord
  belongs_to :job, class_name: '::Delayed::Job', dependent: :destroy

  class << self
    def update_progress(file_id, remote, transfer_data)
      rclone_transfer = find_or_initialize_by(file_id: file_id, remote: remote)
      rclone_transfer.update(transfer_data)
      rclone_transfer
    end
  end

  def status
    return :finished if progress_percentage == 100
    return :stopped if progress_percentage >= 0 && 3.minutes.ago >= updated_at
    return :queued if progress_percentage.negative?

    :processing
  end

  def finished?
    status == :finished
  end

  def queued?
    status == :queued
  end

  def processing?
    status == :processing
  end

  def stopped?
    status == :stopped
  end

  def destination
    [destination_path, file_name].join('/').gsub('//', '/')
  end

  def progress_percentage
    percentage_matched = progress.match(/(\d+)%/)
    return -1 unless percentage_matched

    percentage_matched[1].to_i
  end

  def fshare_file_url
    "https://www.fshare.vn/file/#{file_id}"
  end
end

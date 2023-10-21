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

require "test_helper"

class RcloneTransferTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

# frozen_string_literal: true

class CreateRcloneTransfers < ActiveRecord::Migration[6.1]
  def change
    create_table :rclone_transfers do |t|
      t.string :file_id
      t.string :file_name
      t.string :remote
      t.string :destination_path
      t.string :progress
      t.integer :job_id

      t.timestamps
    end
  end
end

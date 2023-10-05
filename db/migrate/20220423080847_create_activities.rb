# frozen_string_literal: true

class CreateActivities < ActiveRecord::Migration[6.1]
  def change
    create_table :activities do |t|
      t.string :action
      t.string :url
      t.string :file_name
      t.string :file_ext
      t.string :file_type

      t.timestamps
    end
  end
end

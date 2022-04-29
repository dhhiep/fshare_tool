class CreatePlaybacks < ActiveRecord::Migration[6.1]
  def change
    create_table :playbacks do |t|
      t.string :url
      t.string :file_name
      t.integer :current_time, default: 0
      t.integer :total_time, default: 0

      t.timestamps
    end

    add_index :playbacks, :url
    add_index :playbacks, :file_name
  end
end

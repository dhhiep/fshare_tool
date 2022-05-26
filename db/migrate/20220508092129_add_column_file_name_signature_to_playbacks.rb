# frozen_string_literal: true

class AddColumnFileNameSignatureToPlaybacks < ActiveRecord::Migration[6.1]
  def change
    add_column :playbacks, :file_name_signature, :string

    add_index :playbacks, :file_name_signature
  end
end

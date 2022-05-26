# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_05_08_092129) do

  create_table "activities", force: :cascade do |t|
    t.string "action"
    t.string "url"
    t.string "file_name"
    t.string "file_ext"
    t.string "file_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "playbacks", force: :cascade do |t|
    t.string "url"
    t.string "file_name"
    t.integer "current_time", default: 0
    t.integer "total_time", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "file_name_signature"
    t.index ["file_name"], name: "index_playbacks_on_file_name"
    t.index ["file_name_signature"], name: "index_playbacks_on_file_name_signature"
    t.index ["url"], name: "index_playbacks_on_url"
  end

end

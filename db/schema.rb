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

ActiveRecord::Schema.define(version: 2023_10_05_160552) do

  create_table "activities", force: :cascade do |t|
    t.string "action"
    t.string "url"
    t.string "file_name"
    t.string "file_ext"
    t.string "file_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at", precision: 6
    t.datetime "updated_at", precision: 6
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
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

  create_table "rclone_transfers", force: :cascade do |t|
    t.string "file_id"
    t.string "file_name"
    t.string "remote"
    t.string "destination_path"
    t.string "progress"
    t.integer "job_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end

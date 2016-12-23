# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161223094512) do

  create_table "game_counters", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "easy",       default: 0
    t.integer  "medium",     default: 0
    t.integer  "hard",       default: 0
    t.integer  "expert",     default: 0
    t.integer  "insane",     default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "games", force: :cascade do |t|
    t.integer  "complete"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stashes", force: :cascade do |t|
    t.string   "stashed_grid_numbers"
    t.string   "stashed_grid"
    t.string   "right_solution"
    t.string   "disabled_grid"
    t.decimal  "scores"
    t.string   "level"
    t.string   "time"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "game_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "password_digest"
    t.string   "name"
    t.integer  "scores",          default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end

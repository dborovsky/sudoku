class CreateGameCounters < ActiveRecord::Migration
  def change
    create_table :game_counters do |t|
      t.integer :user_id
      t.integer :easy, default: 0
      t.integer :medium, default: 0
      t.integer :hard, default: 0
      t.integer :expert, default: 0
      t.integer :insane, default: 0
      t.timestamps
    end
  end
end

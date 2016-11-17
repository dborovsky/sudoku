class CreateStashes < ActiveRecord::Migration
  def change
    create_table :stashes do |t|
      t.string :stashed_grid_numbers
      t.string :stashed_grid
      t.string :right_solution
      t.string :disabled_grid
      t.decimal :scores
      t.string :level
      t.string :time
      t.integer :user_id
      t.timestamps
    end
  end
end

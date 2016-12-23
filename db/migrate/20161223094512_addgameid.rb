class Addgameid < ActiveRecord::Migration[5.0]
  def change
    add_column :stashes, :game_id, :int 
  end
end

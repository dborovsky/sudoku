class Addguestfield < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :is_guest, :int
  end
end

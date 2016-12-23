class Creategames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :complete
      t.timestamps
    end
  end
end

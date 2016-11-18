require 'active_record'
require 'circle'


class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :email
      t.string :password_digest
      t.string :name
      t.integer :scores, default: 0
      t.timestamps
    end
  end
end

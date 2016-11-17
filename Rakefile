require "./app"
require "sinatra/activerecord/rake"

namespace :db do
  task :load_config do
    require "./app"
  end
  #desc "Migrate the database"
  
  # task(:migrate => :environment) do
  #   ActiveRecord::Base.logger = Logger.new(STDOUT)
  #   ActiveRecord::Migration.verbose = true
  #   ActiveRecord::Migrator.migrate("db/migrate")
  # end
end

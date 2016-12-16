lock '3.4.0'
#set :default_env, { 'RACK_ENV' => "production" }
set :application, 'sudoku'
set :repo_url, 'git@github.com:dborovsky/sudoku.git'

set :deploy_to, '/home/deploy/sudoku'
set :linked_files, %w{config/database.yml}
set :linked_dirs, %w{ log }


namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  task :migrate do
    on roles(:app) do
      within release_path do
        execute :rake, "db:migrate"
      end
    end
  end


  after 'deploy', 'migrate'
  after :publishing, 'deploy:restart'
  after :finishing, 'deploy:cleanup'
end









# require 'rvm/capistrano'
# require 'bundler/capistrano'
 
# #RVM and bundler settings
#set :bundle_cmd, "/home/deploy/.rvm/gems/ruby-2.3.1:/home/deploy/.rvm/gems/ruby-2.3.1@global"

#set :bundle_dir, "/home/deploy/.rvm/gems/ruby-2.3.1/bin:/home/deploy/.rvm/gems/ruby-2.3.1@global/bin:/home/deploy/.rvm/rubies/ruby-2.3.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/home/deploy/.rvm/bin:/home/deploy/.rvm/bin"
#set :rvm_ruby_string, :local
#set :rack_env, :production
 
# #general info
# set :user, 'deploy'
# set :domain, 'www.sudoku-spielen.org'
# set :applicationdir, "/home/deploy/sudoku/current/public"
# set :scm, 'git'
# set :application, "sudoku"
# set :repository,  "git@github.com:dborovsky/sudoku.git"
# set :branch, 'master'
# set :git_shallow_clone, 1
# set :scm_verbose, true
# set :deploy_via, :remote_cache
 
# role :web, domain                          # Your HTTP server, Apache/etc
# role :app, domain                          # This may be the same as your `Web` server
# role :db,  domain, :primary => true # This is where Rails migrations will run
# #role :db,  "your slave db-server here"
# #deploy config
# set :deploy_to, '/home/deploy/sudoku'
# set :deploy_via, :export
 
# #addition settings. mostly ssh
# ssh_options[:forward_agent] = true
# ssh_options[:keys] = [File.join(ENV["HOME"], ".ssh", "id_rsa")]
# ssh_options[:paranoid] = false
# default_run_options[:pty] = true

 
# # After an initial (cold) deploy, symlink the app and restart nginx
# after "deploy:cold" do
#   admin.nginx_restart
# end
 
# # As this isn't a rails app, we don't start and stop the app invidually
# namespace :deploy do
#   desc "Not starting as we're running passenger."
#   task :start do
#   end
# end  

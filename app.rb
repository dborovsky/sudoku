require "sinatra"
require "pry"
require "sinatra/activerecord"
require 'sinatra/flash'
require 'sinatra/base'
require "./models/user"
require "./models/game_counter"
require "./models/stash"
require "json"
require "pony"
require 'logger'


enable :static
enable :sessions


set :public_folder, File.dirname(__FILE__) + '/assets'

configure :development do
  set :database, { adapter: "postgresql", database: "sudoku_database", pool: 5, timeout: 5000 }
end

configure :production do
  set :database, { adapter: "postgresql", database: "sudoku_prod", pool: 5, timeout: 5000, username: 'deploy', password: 'qwerty123456' }
end

set :static_cache_control, [:public, {:no_store => 1}]

db = ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'] || 'postgres://localhost/sudoku_database')



#logs for production
::Logger.class_eval { alias :write :'<<' }
  access_log = ::File.join(::File.dirname(::File.expand_path(__FILE__)),'log','access.log')
  access_logger = ::Logger.new(access_log)
  error_logger = ::File.new(::File.join(::File.dirname(::File.expand_path(__FILE__)),':stage,log','error.log'),"a+")
  error_logger.sync = true

configure do
    use ::Rack::CommonLogger, access_logger
  end
 
  before {
    env["rack.errors"] =  error_logger
  }  


LEVELS_TABLE = {
  '35': 'easy', '40': 'medium',
  '45': 'hard', '50': 'expert',
  '55': 'insane'
}


helpers do
  def current_user
    if session[:uid].present?
      User.find(session[:uid])
    else
      return false
    end
  end
end


get '/' do
  @top_players = User.all.order('scores desc')
  @stashed_games = current_user ? current_user.stashes : []
  if params[:stashed_game].present?
    @stashed_game = Stash.find(params[:stashed_game])
  end
  @hidden = 'hidden'
  erb :index, :layout => :default
end


get '/kontakte' do
  erb :contacts, :layout => :default
end


get '/rangliste' do
  @top_players = User.all.order('scores desc')
  erb :raiting, :layout => :default
end


get '/regeln' do
  erb :rules, :layout => :default
end


get '/losungstechniken' do
  erb :howto, :layout => :default
end


get '/geschichte' do
  erb :history, :layout => :default
end


get '/datenschutzerklarung' do
  erb :policy, :layout => :default
end


get '/indexold' do
  @top_players = User.all.order('scores desc')
  @stashed_games = current_user ? current_user.stashes : []
  if params[:stashed_game].present?
    @stashed_game = Stash.find(params[:stashed_game])
  end
  erb :indexold
end


post '/send' do
  Pony.mail({
    :to => 'k159msc3a4@cartelera.org', # should set to: xtrance1991@gmail.com
    :from => params[:email],
    :subject => params[:username],
    :body => params[:message],
    :via => :smtp,
    :via_options => {
    :address              => 'smtp.gmail.com',
    :port                 => '587',
    :enable_starttls_auto => true,
    :user_name            => 'cvbelarus@gmail.com',
    :password             => 'dzmitry1982',
    #:authentication       => :plain, # :plain, :login, :cram_md5, no auth by default
    :domain               => "sudoku11.herokuapp.com" # the HELO domain provided by the client to the server
  }
  })

  content_type :json
  { 
    :status =>'OK',
    :data => {
      :email => params[:email],
      :name => params[:username],
      :message => params[:message]
    }
  }.to_json
end


post '/sign_up' do
  # создаём пользователя
  @user = User.new(name: params["name"], email: params["email"], password: params["password"])
  if @user.save
    # кладём id в сессию
    session[:uid] = @user.id
    # добавляем флэш об успешной регистрации
    flash[:notice] = 'Thanks for your sign up. Sign in succeffuly completed.'
  else
    # добавляем флэш об ошибке
    flash[:alert] = 'Sorry, error in your sign up data. Try again, please.'
  end
  # редиректим на главную
  redirect to('/')
end


post '/sign_in' do
  # проверяем зарегистрирован ли пользователь
  user = User.find_by_email(params[:email])
  if user && user.authenticate(params[:password])
    # аутентификация прошла успешно
    # кладём id в сессию
    session[:uid] = user.id
    flash[:notice] = "Hello, #{user.name}! Welcome to sudoku game."
  else
    # ошибка в процессе аутентификации
    flash[:alert] = 'Error on sign in proccess.'
  end
  # редиректим на главную
  redirect to('/')
end


delete '/sign_out' do
  # чистим сессию
  session.clear
  # добавляем флэш
  flash[:notice] = 'Sign out succeffuly completed. See you later.'
  # редиректим на главную
  redirect to('/')
end


post '/game/completed' do
  if current_user
    # обновляем очки
    user = User.find(current_user.id)
    scores = params[:scores].to_i
    user.scores = user.scores + scores
    user.save
    # обновляем количество игр на уровне сложности
    game_counter = user.game_counter
    level = LEVELS_TABLE[ params[:level].to_sym ]
    game_counter[level] = user.game_counter[level] + 1
    game_counter.save
  else
    :ok
  end
end


post '/game/stash' do
  if current_user
    user = User.find(current_user.id)
    params[:disabled_grid] = params[:disabled_grid].values
    params[:stashed_grid_numbers] = params[:stashed_grid_numbers].values.map { |array| array.map(&:to_i) }
    params[:right_solution] = params[:right_solution].values.map { |array| array.map(&:to_i) }
    stash = user.stashes.create(params)
    content_type :json
    { id: stash.id, created_at: stash.created_at.strftime("%b %d, %H:%M"), scores: stash.scores, time: stash.time }.to_json
  else
    halt 401
  end
end

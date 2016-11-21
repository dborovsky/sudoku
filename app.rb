require "sinatra"
require "pry"
require "sinatra/activerecord"
require 'sinatra/flash'
require "./models/user"
require "./models/game_counter"
require "./models/stash"
require "json"
#require "activerecord"

enable :static
enable :sessions

set :public_folder, File.dirname(__FILE__) + '/assets'
set :database, { adapter: "postgresql", database: "sudoku_database", pool: 5, timeout: 5000 }
set :static_cache_control, [:public, {:no_store => 1}]

db = ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'] || 'postgres://localhost/sudoku_database')

#ActiveRecord::Base.establish_connection(
 #     :adapter => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
  #    :host     => db.host,
   #   :username => db.user,
    #  :password => db.password,
     # :database => db.path[1..-1],
      #:encoding => 'utf8'
  #)

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

# get '/rangliste' do
#   @top_players = User.all.order('scores desc')
#   erb :top
# end

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
    { id: stash.id, created_at: stash.created_at.strftime("%b %d, %H:%M") }.to_json
  else
    halt 401
  end
end

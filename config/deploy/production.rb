set :stage, :production

server '46.101.214.91', user: 'deploy', roles: %w{web app db}
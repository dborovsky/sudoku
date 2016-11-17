require 'bcrypt'

class User < ActiveRecord::Base
  include BCrypt
  has_secure_password

  has_one :game_counter
  has_many :stashes

  validates :email, presence: true
  validates :email, uniqueness: true

  after_create do
    GameCounter.create(user_id: self.id)
  end

  def name
    self[:name] || self.email.split('@').first
  end
end

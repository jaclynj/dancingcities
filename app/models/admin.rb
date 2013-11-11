class Admin < ActiveRecord::Base
  attr_accessible :admin_name, :password, :password_confirmation
  attr_accessor :password
  before_save :encrypt_password

# TODO Only admins can add new admins
# TODO Admins should be able to change their passwords

  validates_confirmation_of :password
  validates_presence_of :password, :on => :create
  validates_presence_of :admin_name
  validates_uniqueness_of :admin_name

  def encrypt_password
    if password.present?
      binding.pry
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end

  def self.authenticate(admin_name, password)
    admin = find_by_admin_name(admin_name)
    if admin && admin.password_hash == BCrypt::Engine.hash_secret(password, admin.password_salt)
      admin
    end
  end

end

class AddAdminTable < ActiveRecord::Migration
  def up
    create_table :admins do |t|
      t.string :admin_name
      t.string :password_hash
      t.string :password_salt
      t.timestamps
    end
  end

  def down
  end
end

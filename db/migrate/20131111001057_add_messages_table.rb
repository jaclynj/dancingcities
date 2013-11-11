class AddMessagesTable < ActiveRecord::Migration
  def up
    create_table :messages do |t|
      t.text :message
      t.timestamps
    end
  end

  def down
  end
end

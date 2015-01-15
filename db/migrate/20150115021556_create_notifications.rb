class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
			t.integer :user_id, null: false
			t.integer :noter_id, null: false
			t.string :notification_type, null: false
			t.integer :notification_id, null: false
      t.timestamps null: false
    end
		
		add_index :notifications, :user_id
		add_index :notifications, :noter_id
  end
end

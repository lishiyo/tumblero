class AddNotesCountToUser < ActiveRecord::Migration
	def up
		add_column :users, :notifications_count, :integer, default: 0, null: false

		User.all.each do |u|
			User.reset_counters(u.id, :notifications)
    end
  end

  def down
		remove_column :users, :notifications_count
  end
	
end


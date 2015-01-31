class AddGuestToPosts < ActiveRecord::Migration
  def change
		add_column :posts, :guest, :boolean, default: false
  end
end

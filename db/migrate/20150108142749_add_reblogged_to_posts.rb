class AddRebloggedToPosts < ActiveRecord::Migration
  def change
		add_column :posts, :reblogged, :boolean, default: false
  end
end

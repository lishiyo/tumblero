class AddGuestToBlogs < ActiveRecord::Migration
  def change
		add_column :blogs, :guest, :boolean, default: false
  end
end

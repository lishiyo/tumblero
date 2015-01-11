class AddHandleToBlogs < ActiveRecord::Migration
  def change
		add_column :blogs, :handle, :string
		add_index :blogs, :handle
  end
end

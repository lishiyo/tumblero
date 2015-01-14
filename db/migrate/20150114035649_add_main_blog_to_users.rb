class AddMainBlogToUsers < ActiveRecord::Migration
  def change
		add_column :users, :main_blog_id, :integer
  end
end

class AddReblogsCountToPosts < ActiveRecord::Migration
  def change
		add_column :posts, :reblogs_count, :integer, default: 0
  end
end

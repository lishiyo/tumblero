class ChangeCounterCache < ActiveRecord::Migration
  def change
		remove_column :posts, :reblogs_count, :integer
  end
end

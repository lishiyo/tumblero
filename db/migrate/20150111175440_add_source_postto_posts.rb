class AddSourcePosttoPosts < ActiveRecord::Migration
  def change
		add_column :posts, :source_id, :integer, default: nil
		add_index :posts, :source_id
  end
end

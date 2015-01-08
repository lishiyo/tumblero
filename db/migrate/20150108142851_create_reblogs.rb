class CreateReblogs < ActiveRecord::Migration
  def change
    create_table :reblogs do |t|
			t.integer :blog_id, null: false
      t.integer :post_id, null: false
    end
		
		add_index :reblogs, :blog_id
		add_index :reblogs, :post_id
  end
end

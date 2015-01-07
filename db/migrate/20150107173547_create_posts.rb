class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
			t.integer :blog_id, null: false
      t.text :content
      t.string :filepicker_urls
      t.string :title

      t.timestamps null: false
    end
		
		add_index :posts, :blog_id
  end
end

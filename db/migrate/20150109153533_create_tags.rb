class CreateTags < ActiveRecord::Migration
  def change
    create_table :taggings do |t|
			t.string :name, null: false
			t.integer :user_id
			t.references :taggable, polymorphic: true, index: true
      t.timestamps null: false
    end
		
		add_index :taggings, :user_id
  end
end

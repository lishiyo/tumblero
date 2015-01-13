class AddTagsStringToPosts < ActiveRecord::Migration
	
  def change
		add_column :posts, :tags_string, :string
  end
	
end

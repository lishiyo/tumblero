class AddNotesCountToPosts < ActiveRecord::Migration
	
  def change
		add_column :posts, :total_notes, :integer
  end
	
end

class RemoveTotalNotes < ActiveRecord::Migration
  def change		
		remove_column :posts, :total_notes, :integer
  end
end

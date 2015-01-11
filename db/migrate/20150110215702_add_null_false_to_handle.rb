class AddNullFalseToHandle < ActiveRecord::Migration
  def change
		change_column :blogs, :handle, :string, null: false
  end
end

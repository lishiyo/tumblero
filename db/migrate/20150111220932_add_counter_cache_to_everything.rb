class AddCounterCacheToEverything < ActiveRecord::Migration
	
  def change
		add_column :posts, :reblogs_count, :integer, default: 0
		add_column :posts, :comments_count, :integer, default: 0
		add_column :posts, :likes_count, :integer, default: 0
		add_column :comments, :likes_count, :integer, default: 0
		
		add_column :blogs, :posts_count, :integer, default: 0
		add_column :users, :followed_blogs_count, :integer, default: 0
		add_column :blogs, :followers_count, :integer, default: 0
		
  end
	
end

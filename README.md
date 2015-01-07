#Tumblero

##Minimal Viable Product: Features
Barebones tumblr - you can create multiple blogs and posts for each blog, and follow other blogs. If you follow a blog, you'll see their posts on your dashboard home. You can also "like" and "reblog" posts onto your own blog(s).

**Users can** :

1. Have many blogs and posts, and one dashboard
2. Create Posts (4 types, with attachments): Text, Photo, Link, Quote
3. Follow/unfollow Blogs (get dashboard working!)
4. Like Posts
5. Reblog Posts onto one or more owned blogs
6. Sort posts on dashboard by Recent, Trending (fast-rising in last 24 hours), Popular (week/month/all-time)


##Additional Features
1. Search and Explore: 
  * Users can Tag Posts
  * Explore by Trending (all)
  * Explore by Tags
	  * both the most popular posts
	  * and the most popular blogs in these tags
2. Comment on Posts
  * nested dropdown like Reddit
  * sort by most-liked 
3. Recommended Blogs to follow widget
  * inspired by Twitter - refresh


##Models/Schema outline
1. User.rb
  * :id, :email, :password_digest, :session_token
  * has_many :blogs, :liked_posts, :comments, :followed_blogs (blogs that I follow)
  * has_one :dashboard
2. Blog.rb
  * :id, :avatar_url, :user_id, :name, :description
  * belongs_to :user
  * has_many :followings/:followers (users who follow this blog), :posts, :reblogs
  * has_many :tags, through: :posts, source: :tags
  * **methods**: top_five_tags, count_posts_tagged(tag), tag_score(tag) = (number of posts with this tag * notes per post)
3. Dashboard.rb
  * :id, :user_id
  * belongs_to :user
  * has_many :posts, :followed_blogs
4. Post.rb
  * :id, :blog_id, :content (text), :filepicker_urls (optional)
  * belongs_to :blog (source blog)
  * has_many :likes, :comments, :attachments, :reblogs, :taggings, :tags 
  * Types: Text, Image, Quote, Link
  * **methods**: notes_count (reblogs + likes)
5. Attachment.rb (as Attachable => user, post, blog)
  * :id, :attachable_type (user, post, blog), :attachable_id, :user_id, :filepicker_url
  * belongs_to :attacher
  * may be optional if using filepicker
6. Like.rb (as Likeable => post, comment)
  * :id, :likeable_type, :likeable_id, :user_id
7. Following.rb
  * :id, :user_id (follower_id), :blog_id (followed_id)
  * belongs_to :follower (:user_id), :blog
8. Comment.rb
  * :id, :user_id, :post_id, :parent_comment_id
  * belongs_to :user, :post
9. Reblog.rb (reblog post to a blog)
  * :id, :blog_id, :post_id 
  * dashboard displays both blog’s own posts and reblogs
10. Tag.rb (posts only)
  * :id, :name
  * has_many :taggings, :posts (through :taggings)
11. Tagging.rb (http://www.sitepoint.com/tagging-scratch-rails/)
  * :id, :tag_id, :post_id (=> user_id)
  * belongs_to :tag, :post, :user (through post)


## Basic Usage

Check out the Docs folder to see screenshots of the prototype!

```bash
bundle install
rails s
```

##Resources

- [Google Doc](https://docs.google.com/document/d/1J12ax_i1cOPWMXvC8W7J-bA3-SRQld0zfGq3-VrYUEs/edit)
- [Tumblr](www.tumblr.com)




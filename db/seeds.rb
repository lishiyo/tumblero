# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

3.times do |i|
	tags = ["seed", "random", "hello", "test"].sample(3).join(", ")
	Post.create(title: "Blog One Post ##{i}", blog_id: 1, content: "seed base", tags_string: tags, filepicker_urls: "")
end

3.times do |i|
	tags = ["cats", "seed", "dogs", "corgis", "animals"].sample(3).join(", ")
	Post.create(title: "Blog Three Post ##{i}", blog_id: 3, content: "seed animals", tags_string: tags, filepicker_urls: "")
end
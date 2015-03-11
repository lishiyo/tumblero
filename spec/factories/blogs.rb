require 'faker'

FactoryGirl.define do
	factory :blog do
		association :user, factory: :user, strategy: :build
		
		name { Faker::Internet.user_name }
		handle { Faker::Lorem.characters(10) }
		description "test description"
		guest false
		
		factory :guest_blog do
			guest true
		end
		
# 		factory :blog_with_posts do
			
# 		end
	end
	
end
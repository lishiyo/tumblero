require 'faker'

FactoryGirl.define do
	factory :user do
		email { Faker::Internet.email }
		password 'demodemo'
		guest false
				
		factory :guest_user do
			guest true
		end
		
		factory :user_with_blog do
			transient do
				name Faker::Internet.user_name
				blogs_count 1
			end
			
			after(:create) do |user, evaluator|
				create_list(:blog, evaluator.blogs_count, user:user)
			end
			
		end
		
	end
end
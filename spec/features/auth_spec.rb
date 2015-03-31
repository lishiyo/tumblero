require 'rails_helper'

feature "the sign-up process", js: true do
	
	it "has a new user page" do
		visit "/"
		expect(page).to have_content('Sign Up')
	end
	
	feature "signing up a user" do
			let(:user) { FactoryGirl.build(:user) }
		
		it "redirects to new blog page upon success" do
			
		end
		
	end
	
end
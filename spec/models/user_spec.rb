require 'spec_helper'

RSpec.describe User, :type => :model do
	let(:user) { create(:user) }
	let(:user_with_blog) { create(:user_with_blog) }
	
	before(:each) do
		user
		user_with_blog
	end
	
	it { should validate_presence_of(:email) }
	it { should validate_presence_of(:password_digest) }
 	
	it "has a valid factory" do
		build(:user).should be_valid
		build(:user_with_blog).should be_valid
	end
	
	context "when user is valid" do
		
		it "can create a blog" do
			
		end
		
	end
	
end
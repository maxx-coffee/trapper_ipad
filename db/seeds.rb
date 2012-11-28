
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require 'digest/md5'
Entry.delete_all
Classroom.delete_all

i = 0

10.times do |entry,index|
	classroom = Classroom.create( :name => "class #{entry}")

	10.times do |entry,index|
		
		user = User.create( :name => "user #{entry}",  :classroom_id => classroom.id)

		10.times do |entry, index|
		  i = i + 1
		  Entry.create( :name => "prize #{i}", :delivered => 0, :user_id => user.id)
		end
	end
end
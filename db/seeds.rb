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
	classroom = Classroom.create(:remote_id => Digest::MD5.hexdigest("#{Time.now.to_s}#{entry}"), :name => "class #{entry}")

	10.times do |entry,index|
		i = i + 1
		Entry.create(:remote_id => Digest::MD5.hexdigest("#{Time.now.to_s}#{i}"), :name => "test #{i}", :delivered => 0, :classroom_id => classroom.remote_id)
	end
end
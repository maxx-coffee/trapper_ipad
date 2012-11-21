# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require 'digest/md5'
Entry.delete_all
10.times do |entry,index|
	Entry.create(:remote_id => Digest::MD5.hexdigest("#{Time.now.to_s}#{entry}"), :name => "test #{entry}", :delivered => 0)
end
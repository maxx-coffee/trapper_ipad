class Entry < ActiveRecord::Base
  attr_accessible :delivered, :name, :remote_id, :updated_at, :created_at
  attr_accessor :test
  scope :added_since_last_sync, lambda { |time| where("created_at > ? and updated_at > ?", Time.at(time.to_i / 1000),Time.at(time.to_i / 1000)) }
  scope :updated_since_last_sync, lambda { |time| where("updated_at > ? and created_at < ?", Time.at(time.to_i / 1000),Time.at(time.to_i / 1000)) }

end

class SupportRequest < ActiveRecord::Base
  attr_accessible :description, :status, :student_id, :date, :user_id, :created_at, :updated_at, :sid, :dirty, :action, :controller
  attr_accessor :sid, :dirty, :action, :controller
    scope :added_since_last_sync, lambda { |time| where("created_at > ? and updated_at > ?", Time.at(time.to_i / 1000),Time.at(time.to_i / 1000)) }
  scope :updated_since_last_sync, lambda { |time| where("updated_at > ? and created_at < ?", Time.at(time.to_i / 1000),Time.at(time.to_i / 1000)) }
end

class AddRemoteidToSupportRequest < ActiveRecord::Migration
  def change
  	add_column :support_requests, :remote_id, :string
  end
end

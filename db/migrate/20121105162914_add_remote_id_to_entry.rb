class AddRemoteIdToEntry < ActiveRecord::Migration
  def change
  	add_column :entries, :remote_id, :string
  end
end

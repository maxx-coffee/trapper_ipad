class AddClassToUser < ActiveRecord::Migration
  def change
  	add_column :users, :classroom_id, :integer
  end
end

class AddClassToEntry < ActiveRecord::Migration
  def change
  	add_column :entries, :classroom_id, :integer
  end
end

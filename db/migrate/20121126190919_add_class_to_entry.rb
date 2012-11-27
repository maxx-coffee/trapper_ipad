class AddClassToEntry < ActiveRecord::Migration
  def change
  	add_column :entries, :classroom_id, :string
  end
end

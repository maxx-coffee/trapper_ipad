class AddLapsToUser < ActiveRecord::Migration
  def change
    add_column :users, :laps, :integer
  end
end

class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.string :name
      t.boolean :delivered

      t.timestamp :created_at
      t.timestamp :updated_at
    end
  end
end

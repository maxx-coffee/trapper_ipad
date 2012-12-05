class CreateSupportRequests < ActiveRecord::Migration
  def change
    create_table :support_requests do |t|
      t.integer :student_id
      t.text :status
      t.text :description
      t.datetime :date
      t.integer :user_id

      t.timestamps
    end
  end
end

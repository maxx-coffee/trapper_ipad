class AddProgramToClassroom < ActiveRecord::Migration
  def change
    add_column :classrooms, :program_id, :integer
  end
end

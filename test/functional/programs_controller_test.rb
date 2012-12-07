require 'test_helper'

class ProgramsControllerTest < ActionController::TestCase
  setup do
    @program = programs(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:programs)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create program" do
    assert_difference('Program.count') do
      post :create, program: { name: @program.name }
    end

    assert_response 201
  end

  test "should show program" do
    get :show, id: @program
    assert_response :success
  end

  test "should update program" do
    put :update, id: @program, program: { name: @program.name }
    assert_response 204
  end

  test "should destroy program" do
    assert_difference('Program.count', -1) do
      delete :destroy, id: @program
    end

    assert_response 204
  end
end

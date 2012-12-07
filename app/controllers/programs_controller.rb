class ProgramsController < ApplicationController
  # GET /programs
  # GET /programs.json
  def index
    @programs = Program.all

    render json: @programs
  end

  # GET /programs/1
  # GET /programs/1.json
  def show
    @program = Program.find(params[:id])

    render json: @program
  end

  # GET /programs/new
  # GET /programs/new.json
  def new
    @program = Program.new

    render json: @program
  end

  # POST /programs
  # POST /programs.json
  def create
    @program = Program.new(params[:program])

    if @program.save
      render json: @program, status: :created, location: @program
    else
      render json: @program.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /programs/1
  # PATCH/PUT /programs/1.json
  def update
    @program = Program.find(params[:id])

    if @program.update_attributes(params[:program])
      head :no_content
    else
      render json: @program.errors, status: :unprocessable_entity
    end
  end

  # DELETE /programs/1
  # DELETE /programs/1.json
  def destroy
    @program = Program.find(params[:id])
    @program.destroy

    head :no_content
  end
end

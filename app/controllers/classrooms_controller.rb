class ClassroomsController < ApplicationController
  # GET /classrooms
  # GET /classrooms.json

  require 'digest/md5'
  def index
    @classrooms = Classroom.all
    classrooms = Array.new
    @classrooms.each do |classroom|
      
      classrooms << {
        :created_at => classroom.created_at.to_i * 1000,
        :updated_at => classroom.updated_at.to_i * 1000 ,
        :name => classroom.name,
        :id => classroom.id
      }
    end
    render json: classrooms
  end
  def status
    render json: {status:"ok"} 
  end

  def added
     time = params[:time]
    @classrooms = classroom.added_since_last_sync(time)
    classrooms = Array.new
    @classrooms.each do |classroom|
      
      classrooms << {
        :created_at => classroom.created_at.to_i * 1000,
        :updated_at => classroom.updated_at.to_i * 1000 ,
        :name => classroom.name,
        :id => classroom.id
      }
    end
    render json: classrooms
  end

  def updated
    time = params[:time]
    @classrooms = classroom.updated_since_last_sync(time)
    classrooms = Array.new
    @classrooms.each do |classroom|
      if classroom.delivered == false
        delivered = 0
      else
        delivered = 1
      end
      classrooms << {
        :created_at => classroom.created_at.to_i * 1000,
        :updated_at => classroom.updated_at.to_i * 1000 ,
        :name => classroom.name,
        :id => classroom.id
      }
    end
    render json: classrooms
  end

  # GET /classrooms/1
  # GET /classrooms/1.json
  def show
    @classroom = classroom.find(params[:id])

    render json: @classroom
  end

  # GET /classrooms/new
  # GET /classrooms/new.json
  def new
    @classroom = classroom.new

    render json: @classroom
  end

  # POST /classrooms
  # POST /classrooms.json
  def sync
    classrooms = params[:prizes]

    classrooms.each do |classroom|
      classroom = classroom[1]
      @classroom = classroom.find_or_create_by_id(classroom['id']);
      logger.debug("classroom remote id #{classroom['created_at']}")
      @classroom.update_attributes({:delivered => classroom['delivered']})
    end

  end

  def create
    /#
    params[:classrooms].each do |classroom|
      classroom = ActiveSupport::JSON.decode(classroom)
      @classroom = classroom.new(classroom)
      if @classroom.remote_id.nil?
        @classroom.remote_id = Digest::MD5.hexdigest("#{Time.now.to_s}")
      end
      @classroom.save
    end
    render json: @classrooms
    #/
    @classroom = classroom.new(params[:classroom])
    @classroom.remote_id = Digest::MD5.hexdigest("#{Time.now.to_s}")
    if @classroom.delivered.nil?
      @classroom.delivered = false
    end
    @classroom.save
    render json: @classroom
    
  end

  # PATCH/PUT /classrooms/1
  # PATCH/PUT /classrooms/1.json
  def update
    @classroom = classroom.find(params[:id])

    if @classroom.update_attributes(params[:classroom])
      head :no_content
    else
      render json: @classroom.errors, status: :unprocessable_entity
    end
  end

  # DELETE /classrooms/1
  # DELETE /classrooms/1.json
  def destroy
    @classroom = classroom.find(params[:id])
    @classroom.destroy

    head :no_content
  end

  def delete
    @classroom = classroom.find(params[:id])
    @classroom.destroy

    head :no_content
  end
end

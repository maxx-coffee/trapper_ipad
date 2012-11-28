class UsersController < ApplicationController
  # GET /users
  # GET /users.json

  require 'digest/md5'
  def index
    @users = User.all
    users = Array.new
    @users.each do |entry|
      
      users << {
        :id => entry.id,
        :created_at => entry.created_at.to_i * 1000,
        :updated_at => entry.updated_at.to_i * 1000 ,
        :classroom_id => entry.classroom_id,
        :name => entry.name,
        :id => entry.id
      }
    end
    render json: users
  end
  def status
    render json: {status:"ok"} 
  end

  def added
     time = params[:time]
    @users = Entry.added_since_last_sync(time)
    users = Array.new
    @users.each do |entry|
      if entry.delivered == false
        delivered = 0
      else
        delivered = 1
      end
      users << {
        :id => entry.id,
        :created_at => entry.created_at.to_i * 1000,
        :updated_at => entry.updated_at.to_i * 1000 ,
        :classroom_id => entry.classroom_id,
        :name => entry.name,
        :id => entry.id
      }
    end
    render json: users
  end

  def updated
    time = params[:time]
    @users = Entry.updated_since_last_sync(time)
    users = Array.new
    @users.each do |entry|
      if entry.delivered == false
        delivered = 0
      else
        delivered = 1
      end
      users << {
        :id => entry.id,
        :created_at => entry.created_at.to_i * 1000,
        :updated_at => entry.updated_at.to_i * 1000 ,
        :name => entry.name,
        :id => entry.id
      }
    end
    render json: users
  end

  # GET /users/1
  # GET /users/1.json
  def show
    @entry = Entry.find(params[:id])

    render json: @entry
  end

  # GET /users/new
  # GET /users/new.json
  def new
    @entry = Entry.new

    render json: @entry
  end

  # POST /users
  # POST /users.json
  def sync
    users = params[:prizes]

    users.each do |entry|
      entry = entry[1]
      @entry = Entry.find_or_create_by_id(entry['id']);
      logger.debug("entry remote id #{entry['created_at']}")
      @entry.update_attributes({:delivered => entry['delivered']})
    end

  end

  def create
    /#
    params[:users].each do |entry|
      entry = ActiveSupport::JSON.decode(entry)
      @entry = Entry.new(entry)
      if @entry.remote_id.nil?
        @entry.remote_id = Digest::MD5.hexdigest("#{Time.now.to_s}")
      end
      @entry.save
    end
    render json: @users
    #/
    @entry = Entry.new(params[:entry])
    @entry.classroom_id = "5121d1570117d3209fefcf32dcd329a0";
    @entry.remote_id = Digest::MD5.hexdigest("#{Time.now.to_s}")
    if @entry.delivered.nil?
      @entry.delivered = false
    end
    @entry.save
    render json: @entry
    
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    @entry = Entry.find(params[:id])

    if @entry.update_attributes(params[:entry])
      head :no_content
    else
      render json: @entry.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @entry = Entry.find(params[:id])
    @entry.destroy

    head :no_content
  end

  def delete
    @entry = Entry.find(params[:id])
    @entry.destroy

    head :no_content
  end
end

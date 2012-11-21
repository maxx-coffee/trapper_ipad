class EntriesController < ApplicationController
  # GET /entries
  # GET /entries.json

  require 'digest/md5'
  def index
    @entries = Entry.all
    entries = Array.new
    @entries.each do |entry|
      if entry.delivered == false
        delivered = 0
      else
        delivered = 1
      end
      entries << {
        :remote_id => entry.remote_id,
        :created_at => entry.created_at.to_i * 1000,
        :updated_at => entry.updated_at.to_i * 1000 ,
        :delivered => delivered,
        :name => entry.name,
        :id => entry.id
      }
    end
    render json: entries
  end
  def status
    render json: {status:"ok"} 
  end

  def added
     time = params[:time]
    @entries = Entry.added_since_last_sync(time)
    entries = Array.new
    @entries.each do |entry|
      if entry.delivered == false
        delivered = 0
      else
        delivered = 1
      end
      entries << {
        :remote_id => entry.remote_id,
        :created_at => entry.created_at.to_i * 1000,
        :updated_at => entry.updated_at.to_i * 1000 ,
        :delivered => delivered,
        :name => entry.name,
        :id => entry.id
      }
    end
    render json: entries
  end

  def updated
    time = params[:time]
    @entries = Entry.updated_since_last_sync(time)
    entries = Array.new
    @entries.each do |entry|
      if entry.delivered == false
        delivered = 0
      else
        delivered = 1
      end
      entries << {
        :remote_id => entry.remote_id,
        :created_at => entry.created_at.to_i * 1000,
        :updated_at => entry.updated_at.to_i * 1000 ,
        :delivered => delivered,
        :name => entry.name,
        :id => entry.id
      }
    end
    render json: entries
  end

  # GET /entries/1
  # GET /entries/1.json
  def show
    @entry = Entry.find(params[:id])

    render json: @entry
  end

  # GET /entries/new
  # GET /entries/new.json
  def new
    @entry = Entry.new

    render json: @entry
  end

  # POST /entries
  # POST /entries.json
  def sync
    entries = params[:prizes]

    entries.each do |entry|
      entry = entry[1]
      @entry = Entry.find_or_create_by_remote_id(entry['remote_id']);
      logger.debug("entry remote id #{entry['created_at']}")
      @entry.update_attributes({:delivered => entry['delivered']})
    end

  end

  def create
    /#
    params[:entries].each do |entry|
      entry = ActiveSupport::JSON.decode(entry)
      @entry = Entry.new(entry)
      if @entry.remote_id.nil?
        @entry.remote_id = Digest::MD5.hexdigest("#{Time.now.to_s}")
      end
      @entry.save
    end
    render json: @entries
    #/
    @entry = Entry.new(params[:entry])
    @entry.remote_id = Digest::MD5.hexdigest("#{Time.now.to_s}")
    if @entry.delivered.nil?
      @entry.delivered = false
    end
    @entry.save
    render json: @entry
    
  end

  # PATCH/PUT /entries/1
  # PATCH/PUT /entries/1.json
  def update
    @entry = Entry.find(params[:id])

    if @entry.update_attributes(params[:entry])
      head :no_content
    else
      render json: @entry.errors, status: :unprocessable_entity
    end
  end

  # DELETE /entries/1
  # DELETE /entries/1.json
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

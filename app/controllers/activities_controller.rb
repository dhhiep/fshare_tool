# frozen_string_literal: true

class ActivitiesController < ApplicationController
  def index
    @q = Activity.ransack(params[:q])
    @activities = @q.result.order(created_at: :desc).page(params[:page]).per(100)
  end

  def destroy
    activity = Activity.find(params[:id])
    activity.destroy

    redirect_to activities_path, notice: "Activity #{activity.file_name} was destroyed successfully!"
  end

  def destroy_all
    Activity.destroy_all

    redirect_to activities_path, notice: 'Activities was destroyed successfully!'
  end
end

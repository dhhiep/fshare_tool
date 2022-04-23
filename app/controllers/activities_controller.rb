# frozen_string_literal: true

class ActivitiesController < ApplicationController
  def index
    @q = Activity.ransack(params[:q])
    @activities = @q.result.order(created_at: :desc).page(params[:page]).per(100)
  end
end

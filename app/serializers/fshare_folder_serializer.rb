# frozen_string_literal: true

class FshareFolderSerializer
  include ActionView::Helpers::NumberHelper

  def self.call(data)
    new(data).call
  end

  def initialize(data)
    @data = data
  end

  def call
    data.map do |row|
      row['_children'] = [] if folder?(row)
      row['size'] = human_size(row['size'])
      row['ext'] = file_ext(row)
      row['modified'] = format_time(row['modified'])
      row['is_video'] = video?(row)
      row['is_subtitle'] = subtitle?(row)

      row
    end
  end

  private

  attr_reader :data

  def folder?(row)
    row['file_type'].to_i.zero?
  end

  def human_size(size)
    return if size.to_i.zero?

    number_to_human_size(size.to_i)
  end

  def file_ext(row)
    row['realname'].to_s.split('.').last.to_s.upcase
  end

  def format_time(unix_time)
    return if unix_time.blank?

    Time.at(unix_time.to_i).strftime('%d/%m/%Y %H:%M:%S')
  end

  def video?(row)
    Vlc::Player::VIDEO_EXTENSIONS.include?(file_ext(row).downcase)
  end

  def subtitle?(row)
    Vlc::Player::SUBTITLE_EXTENSIONS.include?(file_ext(row).downcase)
  end
end
